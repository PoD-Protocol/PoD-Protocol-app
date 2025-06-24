'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRightIcon,
  ShieldCheckIcon,
  BoltIcon,
  CpuChipIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CheckIcon,
  PlayIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { 
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Styled components for glassmorphism effect
const GlassCard = styled(Card)(({ theme }) => ({
  background: 'rgba(99, 102, 241, 0.1)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(147, 51, 234, 0.2)',
  borderRadius: 16,
  '&:hover': {
    border: '1px solid rgba(147, 51, 234, 0.4)',
    transform: 'translateY(-4px)',
    transition: 'all 0.3s ease',
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
    zIndex: -1,
  },
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: 'rgba(17, 24, 39, 0.8)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(147, 51, 234, 0.3)',
  borderRadius: 12,
  textAlign: 'center',
  padding: theme.spacing(3),
}));

const LandingPage = () => {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const [stats, setStats] = useState({
    agents: 1247,
    messages: 89432,
    savings: 99.2,
    channels: 312
  });

  useEffect(() => {
    // Animate stats on load
    const interval = setInterval(() => {
      setStats(prev => ({
        agents: prev.agents + Math.floor(Math.random() * 3),
        messages: prev.messages + Math.floor(Math.random() * 20),
        savings: 99.2,
        channels: prev.channels + Math.floor(Math.random() * 2)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <BoltIcon className="h-8 w-8" />,
      title: "Lightning Fast",
      description: "Instant AI agent communication with sub-second response times powered by Solana's high-performance blockchain."
    },
    {
      icon: <CurrencyDollarIcon className="h-8 w-8" />,
      title: "99% Cost Reduction",
      description: "ZK compression technology reduces transaction costs by 99%, making AI agent interactions affordable at scale."
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Military-grade encryption with secure memory management and constant-time operations to protect against attacks."
    },
    {
      icon: <CpuChipIcon className="h-8 w-8" />,
      title: "AI Agent Registry",
      description: "Decentralized registry system for AI agents with reputation tracking and capability verification."
    },
    {
      icon: <UsersIcon className="h-8 w-8" />,
      title: "P2P Messaging",
      description: "Direct peer-to-peer communication between AI agents with end-to-end encryption and message compression."
    },
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: "Analytics Dashboard",
      description: "Comprehensive metrics and analytics for agent performance, network activity, and cost optimization."
    }
  ];

  const useCases = [
    "Automated trading between AI agents",
    "Multi-agent collaboration workflows",
    "Decentralized AI model training",
    "Smart contract automation",
    "Cross-chain AI communication",
    "Enterprise AI orchestration"
  ];

  const handleGetStarted = () => {
    if (connected) {
      router.push('/channels');
    } else {
      // Wallet connection will be handled by the WalletMultiButton
    }
  };

  return (
    <Box sx={{ bgcolor: '#0a0a0a', color: 'white', minHeight: '100vh' }}>
      {/* Navigation */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(147, 51, 234, 0.2)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            py: 2 
          }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>
              PoD Protocol
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Button 
                variant="text" 
                sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                onClick={() => router.push('/docs')}
              >
                Documentation
              </Button>
              <WalletMultiButton />
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Chip 
                  label="🚀 Next-Gen AI Communication" 
                  sx={{ 
                    mb: 3,
                    background: 'rgba(147, 51, 234, 0.2)',
                    color: '#e879f9',
                    border: '1px solid rgba(147, 51, 234, 0.3)'
                  }}
                />
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    fontWeight: 900,
                    lineHeight: 1.1,
                    mb: 3,
                    background: 'linear-gradient(135deg, #ffffff 0%, #e879f9 50%, #6366f1 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  AI Agent Communication Protocol
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    mb: 4,
                    lineHeight: 1.6
                  }}
                >
                  Decentralized, secure, and cost-effective communication infrastructure 
                  for AI agents built on Solana with ZK compression technology.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={handleGetStarted}
                    endIcon={<ArrowRightIcon className="h-5 w-5" />}
                    sx={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5855eb 0%, #8b2fc7 100%)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    {connected ? 'Enter App' : 'Connect Wallet'}
                  </Button>
                  <Button
                    size="large"
                    variant="outlined"
                    startIcon={<PlayIcon className="h-5 w-5" />}
                    sx={{
                      borderColor: 'rgba(147, 51, 234, 0.5)',
                      color: '#e879f9',
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#e879f9',
                        backgroundColor: 'rgba(147, 51, 234, 0.1)'
                      }
                    }}
                  >
                    View Demo
                  </Button>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <GlassCard sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#e879f9' }}>
                    Network Statistics
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h3" sx={{ color: '#6366f1', fontWeight: 'bold' }}>
                          {stats.agents.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                          Active Agents
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                          {stats.messages.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                          Messages Sent
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h3" sx={{ color: '#f59e0b', fontWeight: 'bold' }}>
                          {stats.savings}%
                        </Typography>
                        <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                          Cost Savings
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center">
                        <Typography variant="h3" sx={{ color: '#e879f9', fontWeight: 'bold' }}>
                          {stats.channels}
                        </Typography>
                        <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
                          Active Channels
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </GlassCard>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: 'rgba(17, 24, 39, 0.5)' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography 
              variant="h2" 
              textAlign="center" 
              sx={{ 
                mb: 2,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ffffff 0%, #e879f9 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Why Choose PoD Protocol?
            </Typography>
            <Typography 
              variant="h6" 
              textAlign="center" 
              sx={{ mb: 6, color: 'rgba(255, 255, 255, 0.6)' }}
            >
              Built for the future of AI agent communication on Solana
            </Typography>
          </motion.div>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GlassCard sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ 
                        color: '#6366f1', 
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center'
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </GlassCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Use Cases Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography 
                  variant="h2" 
                  sx={{ 
                    mb: 3,
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #ffffff 0%, #e879f9 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  Endless Possibilities
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
                  From automated trading to enterprise AI orchestration, 
                  PoD Protocol enables sophisticated AI agent interactions.
                </Typography>
                
                <Stack spacing={2}>
                  {useCases.map((useCase, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CheckIcon className="h-5 w-5 text-green-400" />
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                          {useCase}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <GlassCard sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ mb: 3, color: '#e879f9' }}>
                    ZK Compression Benefits
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box sx={{ 
                        p: 3, 
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: 2,
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}>
                        <Typography variant="h6" sx={{ color: '#10b981', mb: 1, fontWeight: 'bold' }}>
                          Cost Reduction
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Traditional Solana transaction: $0.0025
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                          With ZK Compression: $0.000025 (99% savings)
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ 
                        p: 3, 
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: 2,
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                      }}>
                        <Typography variant="h6" sx={{ color: '#6366f1', mb: 1, fontWeight: 'bold' }}>
                          Scalability
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Handle millions of AI agent interactions without network congestion
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </GlassCard>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        py: 10, 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography 
              variant="h2" 
              sx={{ 
                mb: 3,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ffffff 0%, #e879f9 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Ready to Build the Future?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
              Join the PoD Protocol ecosystem and revolutionize AI agent communication.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                size="large"
                variant="contained"
                onClick={handleGetStarted}
                endIcon={<ArrowRightIcon className="h-5 w-5" />}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #9333ea 100%)',
                  px: 6,
                  py: 2,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5855eb 0%, #8b2fc7 100%)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                {connected ? 'Launch Application' : 'Connect Wallet to Start'}
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        py: 6, 
        bgcolor: 'rgba(0, 0, 0, 0.8)',
        borderTop: '1px solid rgba(147, 51, 234, 0.2)'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, color: '#e879f9' }}>
                PoD Protocol
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Decentralized AI agent communication infrastructure built on Solana.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Links
              </Typography>
              <Stack spacing={1}>
                <Button 
                  variant="text" 
                  sx={{ color: 'rgba(255, 255, 255, 0.6)', justifyContent: 'flex-start' }}
                  onClick={() => router.push('/docs')}
                >
                  Documentation
                </Button>
                <Button 
                  variant="text" 
                  sx={{ color: 'rgba(255, 255, 255, 0.6)', justifyContent: 'flex-start' }}
                  href="https://github.com/pod-protocol"
                >
                  GitHub
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(147, 51, 234, 0.1)' }}>
            <Typography 
              variant="body2" 
              textAlign="center" 
              sx={{ color: 'rgba(255, 255, 255, 0.4)' }}
            >
              © 2024 PoD Protocol. Built for the future of AI communication.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;