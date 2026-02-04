import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface Invitation {
  id: string;
  from_user_id: string;
  to_user_id: string;
  hackathon_id: string | null;
  status: 'pending' | 'accepted' | 'declined';
  message: string | null;
  created_at: string;
  updated_at: string;
  from_profile?: {
    id: string;
    name: string;
    email: string;
    education: string;
    skills: string[];
  };
  to_profile?: {
    id: string;
    name: string;
    email: string;
    education: string;
    skills: string[];
  };
}

interface InvitationState {
  receivedInvitations: Invitation[];
  sentInvitations: Invitation[];
  isLoading: boolean;
  unreadCount: number;
  fetchInvitations: (userId: string) => Promise<void>;
  sendInvitation: (fromUserId: string, toUserId: string, hackathonId?: string, message?: string) => Promise<boolean>;
  respondToInvitation: (invitationId: string, status: 'accepted' | 'declined') => Promise<boolean>;
  subscribeToInvitations: (userId: string) => () => void;
}

export const useInvitationStore = create<InvitationState>((set, get) => ({
  receivedInvitations: [],
  sentInvitations: [],
  isLoading: false,
  unreadCount: 0,

  fetchInvitations: async (userId: string) => {
    set({ isLoading: true });
    try {
      // Fetch received invitations
      const { data: received, error: receivedError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('to_user_id', userId)
        .order('created_at', { ascending: false });

      // Fetch sent invitations
      const { data: sent, error: sentError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('from_user_id', userId)
        .order('created_at', { ascending: false });

      if (receivedError) throw receivedError;
      if (sentError) throw sentError;

      // Fetch profile data for invitations
      const allUserIds = new Set<string>();
      received?.forEach(inv => allUserIds.add(inv.from_user_id));
      sent?.forEach(inv => allUserIds.add(inv.to_user_id));

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, email, education, skills')
        .in('id', Array.from(allUserIds));

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const enrichedReceived = received?.map(inv => ({
        ...inv,
        status: inv.status as 'pending' | 'accepted' | 'declined',
        from_profile: profileMap.get(inv.from_user_id),
      })) || [];

      const enrichedSent = sent?.map(inv => ({
        ...inv,
        status: inv.status as 'pending' | 'accepted' | 'declined',
        to_profile: profileMap.get(inv.to_user_id),
      })) || [];

      const unreadCount = enrichedReceived.filter(inv => inv.status === 'pending').length;

      set({
        receivedInvitations: enrichedReceived,
        sentInvitations: enrichedSent,
        unreadCount,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching invitations:', error);
      set({ isLoading: false });
    }
  },

  sendInvitation: async (fromUserId: string, toUserId: string, hackathonId?: string, message?: string) => {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .insert({
          from_user_id: fromUserId,
          to_user_id: toUserId,
          hackathon_id: hackathonId || null,
          message: message || null,
        });

      if (error) {
        if (error.code === '23505') {
          // Already invited
          return false;
        }
        throw error;
      }

      // Refresh invitations
      await get().fetchInvitations(fromUserId);
      return true;
    } catch (error) {
      console.error('Error sending invitation:', error);
      return false;
    }
  },

  respondToInvitation: async (invitationId: string, status: 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status })
        .eq('id', invitationId);

      if (error) throw error;

      // Update local state
      set(state => ({
        receivedInvitations: state.receivedInvitations.map(inv =>
          inv.id === invitationId ? { ...inv, status } : inv
        ),
        unreadCount: state.receivedInvitations.filter(
          inv => inv.id !== invitationId && inv.status === 'pending'
        ).length,
      }));

      return true;
    } catch (error) {
      console.error('Error responding to invitation:', error);
      return false;
    }
  },

  subscribeToInvitations: (userId: string) => {
    const channel = supabase
      .channel('invitation-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_invitations',
          filter: `to_user_id=eq.${userId}`,
        },
        () => {
          // Refresh invitations when changes occur
          get().fetchInvitations(userId);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_invitations',
          filter: `from_user_id=eq.${userId}`,
        },
        () => {
          // Refresh invitations when changes occur
          get().fetchInvitations(userId);
        }
      )
      .subscribe();

    // Return cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
