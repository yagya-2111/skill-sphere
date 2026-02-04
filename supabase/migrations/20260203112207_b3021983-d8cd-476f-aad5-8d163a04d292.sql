-- Create profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    education TEXT NOT NULL DEFAULT 'BTech',
    skills TEXT[] NOT NULL DEFAULT '{}',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hackathons table
CREATE TABLE public.hackathons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    skills_required TEXT[] NOT NULL DEFAULT '{}',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('Online', 'Offline', 'Hybrid')),
    status TEXT NOT NULL CHECK (status IN ('Upcoming', 'Ongoing', 'Completed')),
    image_url TEXT,
    prize_pool TEXT,
    organizer TEXT,
    location TEXT,
    max_team_size INTEGER DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enrollments table
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hackathon_id UUID NOT NULL REFERENCES public.hackathons(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, hackathon_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Hackathons policies (everyone can read)
CREATE POLICY "Anyone can view hackathons" ON public.hackathons
    FOR SELECT USING (true);

-- Enrollments policies
CREATE POLICY "Users can view all enrollments" ON public.enrollments
    FOR SELECT USING (true);

CREATE POLICY "Users can enroll themselves" ON public.enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own enrollments" ON public.enrollments
    FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, education, skills)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'education', 'BTech'),
        COALESCE(
            ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'skills')),
            '{}'::TEXT[]
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- SEED DATA: 30+ Hackathons
INSERT INTO public.hackathons (title, description, skills_required, start_date, end_date, mode, status, image_url, prize_pool, organizer, location, max_team_size) VALUES
-- AI/ML Hackathons
('AI Innovation Challenge 2024', 'Build cutting-edge AI solutions to solve real-world problems. Focus on generative AI, computer vision, and NLP applications.', ARRAY['Artificial Intelligence', 'Machine Learning', 'Backend'], '2024-03-15', '2024-03-17', 'Online', 'Upcoming', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800', '$50,000', 'Google Developer Groups', 'Virtual', 4),
('DeepMind Student Hackathon', 'Create AI agents that can learn and adapt. Explore reinforcement learning and neural network architectures.', ARRAY['Machine Learning', 'Artificial Intelligence', 'Full Stack'], '2024-02-20', '2024-02-22', 'Hybrid', 'Ongoing', 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800', '$30,000', 'DeepMind', 'London, UK', 3),
('ML for Healthcare', 'Apply machine learning to healthcare challenges. Build diagnostic tools, prediction models, and patient care solutions.', ARRAY['Machine Learning', 'Backend', 'Cloud Computing'], '2024-04-10', '2024-04-12', 'Online', 'Upcoming', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800', '$25,000', 'Microsoft Health', 'Virtual', 4),
('Computer Vision Quest', 'Develop innovative computer vision applications for accessibility, security, and automation.', ARRAY['Artificial Intelligence', 'Machine Learning', 'Full Stack'], '2024-03-25', '2024-03-27', 'Online', 'Upcoming', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800', '$20,000', 'NVIDIA', 'Virtual', 4),

-- Web Development Hackathons
('WebDev Masters 2024', 'Showcase your frontend and backend skills. Build responsive, accessible, and performant web applications.', ARRAY['Frontend', 'Backend', 'Full Stack', 'UI/UX'], '2024-03-01', '2024-03-03', 'Online', 'Upcoming', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800', '$15,000', 'Vercel', 'Virtual', 4),
('React Revolution', 'Build amazing React applications with modern patterns, hooks, and state management.', ARRAY['Frontend', 'Full Stack', 'Web Development'], '2024-02-25', '2024-02-27', 'Online', 'Ongoing', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800', '$12,000', 'Meta Open Source', 'Virtual', 3),
('Full Stack Fusion', 'End-to-end web development challenge. Create complete applications with modern tech stacks.', ARRAY['Full Stack', 'Backend', 'Frontend', 'Cloud Computing'], '2024-04-05', '2024-04-07', 'Offline', 'Upcoming', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', '$20,000', 'AWS', 'San Francisco, CA', 4),
('Progressive Web Apps Challenge', 'Build PWAs that work offline, load instantly, and provide native-like experiences.', ARRAY['Frontend', 'Web Development', 'UI/UX'], '2024-03-20', '2024-03-22', 'Online', 'Upcoming', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800', '$10,000', 'Google Chrome Team', 'Virtual', 3),

-- Blockchain Hackathons
('DeFi Builders Summit', 'Create decentralized finance applications. Build lending protocols, DEXs, and yield optimization tools.', ARRAY['Blockchain', 'Full Stack', 'Backend'], '2024-03-10', '2024-03-12', 'Hybrid', 'Upcoming', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800', '$100,000', 'Ethereum Foundation', 'Denver, CO', 5),
('NFT Innovation Lab', 'Explore the future of digital ownership. Build NFT platforms, marketplaces, and creative applications.', ARRAY['Blockchain', 'Frontend', 'UI/UX'], '2024-02-28', '2024-03-02', 'Online', 'Ongoing', 'https://images.unsplash.com/photo-1645731504573-275f7e67b6d6?w=800', '$40,000', 'OpenSea', 'Virtual', 4),
('Web3 Gaming Hackathon', 'Build blockchain-based games with play-to-earn mechanics and true digital ownership.', ARRAY['Blockchain', 'Full Stack', 'Frontend'], '2024-04-15', '2024-04-17', 'Online', 'Upcoming', 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800', '$75,000', 'Polygon Labs', 'Virtual', 5),
('Smart Contract Security', 'Focus on building secure smart contracts. Audit, test, and deploy bulletproof blockchain code.', ARRAY['Blockchain', 'Backend'], '2024-03-30', '2024-04-01', 'Online', 'Upcoming', 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800', '$35,000', 'Chainlink', 'Virtual', 3),

-- Cloud Computing Hackathons
('Cloud Native Challenge', 'Build scalable, resilient applications using Kubernetes, serverless, and microservices.', ARRAY['Cloud Computing', 'Backend', 'Full Stack'], '2024-03-08', '2024-03-10', 'Online', 'Upcoming', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800', '$30,000', 'CNCF', 'Virtual', 4),
('Serverless Summit', 'Create applications without managing infrastructure. Focus on AWS Lambda, Azure Functions, and more.', ARRAY['Cloud Computing', 'Backend', 'Full Stack'], '2024-02-22', '2024-02-24', 'Online', 'Ongoing', 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800', '$25,000', 'AWS', 'Virtual', 4),
('Multi-Cloud Mastery', 'Build applications that leverage multiple cloud providers for resilience and optimization.', ARRAY['Cloud Computing', 'Backend'], '2024-04-20', '2024-04-22', 'Hybrid', 'Upcoming', 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800', '$40,000', 'HashiCorp', 'Austin, TX', 4),
('Edge Computing Hackathon', 'Deploy applications at the edge for ultra-low latency. IoT, CDN, and distributed systems.', ARRAY['Cloud Computing', 'Backend', 'Full Stack'], '2024-03-18', '2024-03-20', 'Online', 'Upcoming', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800', '$20,000', 'Cloudflare', 'Virtual', 3),

-- UI/UX Hackathons
('Design Systems Sprint', 'Create comprehensive design systems with components, tokens, and documentation.', ARRAY['UI/UX', 'Frontend'], '2024-03-05', '2024-03-07', 'Online', 'Upcoming', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', '$15,000', 'Figma', 'Virtual', 3),
('Accessibility Hackathon', 'Build inclusive digital experiences. Focus on WCAG compliance and assistive technologies.', ARRAY['UI/UX', 'Frontend', 'Web Development'], '2024-02-18', '2024-02-20', 'Online', 'Ongoing', 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800', '$18,000', 'Microsoft', 'Virtual', 4),
('Mobile UX Challenge', 'Design intuitive mobile experiences. Focus on gestures, animations, and user flows.', ARRAY['UI/UX', 'Frontend'], '2024-04-08', '2024-04-10', 'Online', 'Upcoming', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800', '$12,000', 'Apple Developer', 'Virtual', 3),
('Dark Mode Design Sprint', 'Create stunning dark mode interfaces with proper contrast and visual hierarchy.', ARRAY['UI/UX', 'Frontend', 'Web Development'], '2024-03-22', '2024-03-24', 'Online', 'Upcoming', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800', '$8,000', 'GitHub', 'Virtual', 2),

-- Open Innovation Hackathons
('Climate Tech Challenge', 'Build technology solutions to combat climate change. Sustainability meets innovation.', ARRAY['Full Stack', 'Cloud Computing', 'Machine Learning'], '2024-03-12', '2024-03-14', 'Hybrid', 'Upcoming', 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800', '$50,000', 'UN Environment', 'New York, NY', 5),
('Social Impact Hackathon', 'Create solutions for social good. Education, healthcare, poverty, and community building.', ARRAY['Full Stack', 'UI/UX', 'Backend'], '2024-02-26', '2024-02-28', 'Online', 'Ongoing', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800', '$25,000', 'Hack for Good', 'Virtual', 4),
('Smart City Solutions', 'Build applications for urban challenges. Transportation, energy, safety, and civic engagement.', ARRAY['Full Stack', 'Cloud Computing', 'Artificial Intelligence'], '2024-04-18', '2024-04-20', 'Offline', 'Upcoming', 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800', '$45,000', 'Smart City Consortium', 'Singapore', 5),
('EdTech Innovation', 'Transform education with technology. Learning platforms, assessment tools, and student engagement.', ARRAY['Full Stack', 'UI/UX', 'Frontend', 'Machine Learning'], '2024-03-28', '2024-03-30', 'Online', 'Upcoming', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', '$20,000', 'EdTech Collective', 'Virtual', 4),

-- Student-focused Hackathons
('CodeJam University', 'Exclusive hackathon for university students. Showcase your skills and win internship opportunities.', ARRAY['Full Stack', 'Frontend', 'Backend'], '2024-03-02', '2024-03-04', 'Hybrid', 'Upcoming', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800', '$15,000 + Internships', 'Major Tech Companies', 'Multiple Campuses', 4),
('First-Time Hackers', 'Perfect for beginners! Learn, build, and connect with mentors in a supportive environment.', ARRAY['Web Development', 'Frontend', 'UI/UX'], '2024-02-24', '2024-02-25', 'Online', 'Ongoing', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800', '$5,000', 'MLH', 'Virtual', 3),
('Women in Tech Hackathon', 'Celebrating women developers. Build projects, network, and break barriers in tech.', ARRAY['Full Stack', 'UI/UX', 'Machine Learning'], '2024-04-12', '2024-04-14', 'Hybrid', 'Upcoming', 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?w=800', '$30,000', 'Women Who Code', 'Boston, MA', 4),
('Campus Innovation Week', 'Week-long hackathon across universities. Collaborate across campuses and disciplines.', ARRAY['Full Stack', 'Cloud Computing', 'Artificial Intelligence'], '2024-03-18', '2024-03-24', 'Hybrid', 'Upcoming', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800', '$25,000', 'University Alliance', 'Multiple Locations', 5),
('Startup Weekend Student Edition', 'Turn your idea into a startup in 54 hours. Pitch, build, and launch.', ARRAY['Full Stack', 'UI/UX', 'Backend'], '2024-04-05', '2024-04-07', 'Offline', 'Upcoming', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', '$10,000 + Incubation', 'Techstars', 'Various Cities', 5),
('Freshers Code Sprint', 'Designed for first-year students. No experience needed, just enthusiasm to learn!', ARRAY['Web Development', 'Frontend'], '2024-02-28', '2024-03-01', 'Online', 'Ongoing', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800', '$3,000', 'College Coding Club', 'Virtual', 2),

-- Additional themed hackathons
('FinTech Frontier', 'Revolutionize finance with technology. Payments, banking, investing, and insurance innovation.', ARRAY['Full Stack', 'Backend', 'Blockchain', 'Cloud Computing'], '2024-04-22', '2024-04-24', 'Hybrid', 'Upcoming', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', '$60,000', 'FinTech Alliance', 'New York, NY', 4),
('IoT Connected World', 'Build Internet of Things solutions. Smart homes, wearables, and connected devices.', ARRAY['Backend', 'Cloud Computing', 'Full Stack'], '2024-03-15', '2024-03-17', 'Online', 'Upcoming', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', '$22,000', 'Arduino', 'Virtual', 4),
('Cybersecurity Challenge', 'Defend and protect. Build security tools, detect vulnerabilities, and secure systems.', ARRAY['Backend', 'Cloud Computing', 'Full Stack'], '2024-04-01', '2024-04-03', 'Online', 'Upcoming', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', '$35,000', 'CrowdStrike', 'Virtual', 3);