-- Create team_invitations table to store invitation data
CREATE TABLE public.team_invitations (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    from_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    to_user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hackathon_id uuid REFERENCES public.hackathons(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    message text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (from_user_id, to_user_id, hackathon_id)
);

-- Enable RLS
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Users can view invitations they sent or received
CREATE POLICY "Users can view their invitations"
ON public.team_invitations
FOR SELECT
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Users can send invitations
CREATE POLICY "Users can send invitations"
ON public.team_invitations
FOR INSERT
WITH CHECK (auth.uid() = from_user_id);

-- Users can update invitations they received (accept/decline)
CREATE POLICY "Users can respond to invitations"
ON public.team_invitations
FOR UPDATE
USING (auth.uid() = to_user_id);

-- Users can delete invitations they sent
CREATE POLICY "Users can delete sent invitations"
ON public.team_invitations
FOR DELETE
USING (auth.uid() = from_user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_team_invitations_updated_at
BEFORE UPDATE ON public.team_invitations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_invitations;