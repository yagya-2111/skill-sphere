import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import { useInvitationStore } from '@/stores/invitationStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Bell,
  Check,
  X,
  UserPlus,
  Users,
  Loader2,
  Inbox,
  ChevronRight,
} from 'lucide-react';
import { PulsingDot } from '@/components/animations';

export function NotificationDropdown() {
  const { profile } = useAuthStore();
  const { 
    receivedInvitations, 
    sentInvitations,
    unreadCount, 
    fetchInvitations, 
    respondToInvitation,
    subscribeToInvitations,
    isLoading 
  } = useInvitationStore();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [respondingId, setRespondingId] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.id) {
      fetchInvitations(profile.id);
      const unsubscribe = subscribeToInvitations(profile.id);
      return unsubscribe;
    }
  }, [profile?.id]);

  const handleRespond = async (invitationId: string, status: 'accepted' | 'declined') => {
    setRespondingId(invitationId);
    const success = await respondToInvitation(invitationId, status);
    
    if (success) {
      toast({
        title: status === 'accepted' ? 'Invitation Accepted! 🎉' : 'Invitation Declined',
        description: status === 'accepted' 
          ? 'You are now part of the team!' 
          : 'The invitation has been declined.',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to respond to invitation. Please try again.',
        variant: 'destructive',
      });
    }
    setRespondingId(null);
  };

  const pendingInvitations = receivedInvitations.filter(inv => inv.status === 'pending');
  const respondedInvitations = receivedInvitations.filter(inv => inv.status !== 'pending');

  return (
    <div className="relative">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-9 w-9"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 mt-2 w-80 md:w-96 z-50 glass-card rounded-2xl overflow-hidden shadow-xl border border-border/50"
            >
              {/* Header */}
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {unreadCount} pending
                    </span>
                  )}
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('received')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'received'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Received
                    {pendingInvitations.length > 0 && (
                      <span className="ml-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-[10px] inline-flex items-center justify-center">
                        {pendingInvitations.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('sent')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'sent'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    Sent
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : activeTab === 'received' ? (
                  <>
                    {/* Pending invitations */}
                    {pendingInvitations.length > 0 && (
                      <div>
                        <p className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/30">
                          Pending Invitations
                        </p>
                        {pendingInvitations.map((invitation, i) => (
                          <motion.div
                            key={invitation.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-4 border-b border-border/50 hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black font-bold flex-shrink-0">
                                {invitation.from_profile?.name?.charAt(0) || '?'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">
                                  <span className="text-primary">{invitation.from_profile?.name}</span>
                                  {' '}invited you to join their team
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {format(new Date(invitation.created_at), 'MMM d, h:mm a')}
                                </p>
                                {invitation.message && (
                                  <p className="text-xs text-muted-foreground mt-1 italic">
                                    "{invitation.message}"
                                  </p>
                                )}
                                <div className="flex gap-2 mt-3">
                                  <Button
                                    size="sm"
                                    onClick={() => handleRespond(invitation.id, 'accepted')}
                                    disabled={respondingId === invitation.id}
                                    className="h-8 gap-1 bg-emerald-500 hover:bg-emerald-600"
                                  >
                                    {respondingId === invitation.id ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <Check className="h-3 w-3" />
                                    )}
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRespond(invitation.id, 'declined')}
                                    disabled={respondingId === invitation.id}
                                    className="h-8 gap-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                                  >
                                    <X className="h-3 w-3" />
                                    Decline
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Past invitations */}
                    {respondedInvitations.length > 0 && (
                      <div>
                        <p className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/30">
                          Previous
                        </p>
                        {respondedInvitations.slice(0, 5).map((invitation) => (
                          <div
                            key={invitation.id}
                            className="p-4 border-b border-border/50 opacity-60"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-bold">
                                {invitation.from_profile?.name?.charAt(0) || '?'}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">
                                  <span className="font-medium">{invitation.from_profile?.name}</span>'s invite
                                </p>
                                <span className={`text-xs ${
                                  invitation.status === 'accepted' ? 'text-emerald-500' : 'text-muted-foreground'
                                }`}>
                                  {invitation.status === 'accepted' ? '✓ Accepted' : '✕ Declined'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {receivedInvitations.length === 0 && (
                      <div className="py-12 text-center">
                        <Inbox className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">No invitations yet</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Team invitations will appear here
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Sent invitations */}
                    {sentInvitations.length > 0 ? (
                      sentInvitations.map((invitation, i) => (
                        <motion.div
                          key={invitation.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-4 border-b border-border/50 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                              {invitation.to_profile?.name?.charAt(0) || '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">
                                Invited <span className="text-primary">{invitation.to_profile?.name}</span>
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  invitation.status === 'pending'
                                    ? 'bg-amber-500/20 text-amber-500'
                                    : invitation.status === 'accepted'
                                    ? 'bg-emerald-500/20 text-emerald-500'
                                    : 'bg-destructive/20 text-destructive'
                                }`}>
                                  {invitation.status === 'pending' && '⏳ Pending'}
                                  {invitation.status === 'accepted' && '✓ Accepted'}
                                  {invitation.status === 'declined' && '✕ Declined'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(invitation.created_at), 'MMM d')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="py-12 text-center">
                        <UserPlus className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">No invitations sent</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Visit Team Match to invite teammates
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
