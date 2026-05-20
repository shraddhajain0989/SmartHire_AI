"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Brain,
  Sparkles,
  Mic,
  FileSearch,
  MessageSquare,
  Code,
  Eye,
  Play,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  Shield,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { GlassCard } from "@/components/glass-card"

const features = [
  {
    icon: Eye,
    title: "Emotion Detection",
    description: "AI analyzes your facial expressions and body language in real-time",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    icon: FileSearch,
    title: "Resume Analysis",
    description: "Get ATS scores and AI-powered suggestions to improve your resume",
    color: "from-purple-500/20 to-purple-500/5",
  },
  {
    icon: MessageSquare,
    title: "AI Feedback",
    description: "Receive detailed feedback on your answers and communication style",
    color: "from-cyan-500/20 to-cyan-500/5",
  },
  {
    icon: Mic,
    title: "Speech Analysis",
    description: "Track speaking pace, filler words, and voice clarity",
    color: "from-green-500/20 to-green-500/5",
  },
  {
    icon: Code,
    title: "Coding Assessment",
    description: "Practice coding interviews with AI-powered code review",
    color: "from-orange-500/20 to-orange-500/5",
  },
]

const stats = [
  { value: "50K+", label: "Interviews Conducted" },
  { value: "95%", label: "Success Rate" },
  { value: "500+", label: "Companies Trust Us" },
  { value: "4.9", label: "User Rating" },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content: "InterviewIQ helped me land my dream job. The AI feedback was incredibly accurate and helped me improve my communication skills.",
    avatar: "SC",
  },
  {
    name: "Michael Rodriguez",
    role: "Product Manager at Meta",
    content: "The emotion detection feature helped me understand my nervous habits. I became much more confident in my interviews.",
    avatar: "MR",
  },
  {
    name: "Emily Johnson",
    role: "Data Scientist at Amazon",
    content: "The coding interview practice was spot-on. The AI review helped me optimize my solutions and explain my thought process better.",
    avatar: "EJ",
  },
]

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for getting started",
    features: ["5 mock interviews/month", "Basic AI feedback", "Resume analysis", "Email support"],
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Best for serious job seekers",
    features: ["Unlimited interviews", "Advanced AI feedback", "Emotion detection", "Coding assessments", "Priority support", "Detailed reports"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams and organizations",
    features: ["Everything in Pro", "Custom branding", "API access", "Dedicated support", "Analytics dashboard", "Bulk pricing"],
    popular: false,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function LandingPage() {
  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">AI-Powered Interview Platform</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gradient">AI-Powered Interview</span>
              <br />
              <span className="text-foreground">Intelligence Platform</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Transform your interview preparation with real-time AI feedback, emotion detection, 
              and comprehensive performance analytics. Land your dream job with confidence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/interview">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-8 py-6 glow-blue">
                  Start Interview
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-border/50 hover:bg-secondary/50">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* AI Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-chart-3/20 blur-3xl" />
            <GlassCard className="relative p-8 md:p-12" hover={false}>
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Left - Video Preview */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary/50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                  <div className="relative text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
                      <Brain className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">AI Interview Assistant</p>
                  </div>
                </div>

                {/* Center - Stats */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm">Confidence: 87%</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-sm">Eye Contact: 92%</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                    <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-sm">Speech Clarity: 95%</span>
                  </div>
                </div>

                {/* Right - AI Chat */}
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-primary/10 text-sm">
                    <p className="text-primary font-medium mb-1">AI Assistant</p>
                    <p className="text-muted-foreground">Great answer! Try to elaborate more on your leadership experience.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30 text-sm ml-4">
                    <p className="text-foreground">{"I led a team of 5 engineers..."}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Powerful Features</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to ace your next interview, powered by cutting-edge AI technology.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <GlassCard glow={index === 0 ? "blue" : index === 1 ? "purple" : "cyan"}>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} w-fit mb-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get started in minutes and improve your interview skills with our simple 3-step process.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Upload Resume", description: "Upload your resume and let our AI analyze your experience", icon: FileSearch },
              { step: 2, title: "Start Interview", description: "Begin your mock interview with our AI interviewer", icon: Mic },
              { step: 3, title: "Get Feedback", description: "Receive detailed analysis and improvement suggestions", icon: MessageSquare },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <GlassCard hover={false}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                      {item.step}
                    </div>
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </GlassCard>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              What Our <span className="text-gradient">Users Say</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of successful candidates who landed their dream jobs with InterviewIQ.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <GlassCard>
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">{`"${testimonial.content}"`}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Simple <span className="text-gradient">Pricing</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the plan that fits your needs. Start free and upgrade anytime.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div key={index} variants={itemVariants}>
                <GlassCard 
                  className={plan.popular ? "border-primary/50 relative" : ""} 
                  glow={plan.popular ? "blue" : "none"}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent rounded-full text-xs font-medium">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? "bg-gradient-to-r from-primary to-accent" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <GlassCard className="text-center p-12" glow="blue" hover={false}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center gap-4 mb-6">
                <Zap className="h-8 w-8 text-primary" />
                <Shield className="h-8 w-8 text-accent" />
                <Globe className="h-8 w-8 text-chart-3" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Ace Your Next Interview?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join thousands of candidates who have transformed their interview skills with InterviewIQ AI.
              </p>
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-lg px-8 py-6">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </main>
  )
}
