'use client'
import React from 'react';
import { MessageCircle, Smartphone, Shield, Bot, Users, Phone, Zap,  Heart, Globe, Headphones } from 'lucide-react';
import Button from '../ui/button';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  bgGradient: string;
}

const FeatureContainer: React.FC = () => {
  const features: Feature[] = [
    {
      title: "Live Website Chat",
      description: "Transform your website into a conversation hub with seamless real-time chat that converts visitors into customers.",
      icon: <MessageCircle className="w-7 h-7" />,
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      title: "Social Media Hub",
      description: "Unite all your conversations from Telegram, Facebook, Instagram, and Viber in one powerful, intuitive dashboard.",
      icon: <Smartphone className="w-7 h-7" />,
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      title: "Smart Callbacks",
      description: "Never miss an opportunity with intelligent callback requests that capture leads even when you're offline.",
      icon: <Phone className="w-7 h-7" />,
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      bgGradient: "from-emerald-50 to-green-50"
    },
    {
      title: "Universal Access",
      description: "Stay connected anywhere with native apps for desktop, mobile, and web - your conversations follow you everywhere.",
      icon: <Users className="w-7 h-7" />,
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      bgGradient: "from-orange-50 to-yellow-50"
    },
    {
      title: "Proactive Engagement",
      description: "Turn passive browsers into active customers with smart invitation triggers and perfectly timed pre-chat prompts.",
      icon: <Zap className="w-7 h-7" />,
      gradient: "from-violet-500 via-purple-500 to-indigo-500",
      bgGradient: "from-violet-50 to-indigo-50"
    },
    {
      title: "Visitor Intelligence",
      description: "Get real-time insights into visitor behavior and engagement patterns to optimize your customer interactions.",
      icon: <Globe className="w-7 h-7" />,
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      bgGradient: "from-cyan-50 to-blue-50"
    },
    {
      title: "AI Assistant",
      description: "Deploy an intelligent virtual assistant that provides instant, accurate responses and seamlessly hands off to human agents.",
      icon: <Bot className="w-7 h-7" />,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      bgGradient: "from-pink-50 to-rose-50"
    },
    {
      title: "Advanced Security",
      description: "Enterprise-grade anti-spam protection and security measures keep your conversations safe and professional.",
      icon: <Shield className="w-7 h-7" />,
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
      bgGradient: "from-slate-50 to-gray-50"
    },
    {
      title: "WhatsApp Business",
      description: "Integrate your WhatsApp Business account for complete omnichannel customer communication management.",
      icon: <MessageCircle className="w-7 h-7" />,
      gradient: "from-green-600 via-emerald-600 to-teal-600",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      title: "Voice Communication",
      description: "Enable rich voice messaging across all social platforms for more personal and engaging customer interactions.",
      icon: <Headphones className="w-7 h-7" />,
      gradient: "from-indigo-500 via-blue-500 to-cyan-500",
      bgGradient: "from-indigo-50 to-blue-50"
    },
    {
      title: "Smart Chatbots",
      description: "Deploy sophisticated AI chatbots with advanced natural language processing and custom conversation flows.",
      icon: <Bot className="w-7 h-7" />,
      gradient: "from-teal-500 via-cyan-500 to-blue-500",
      bgGradient: "from-teal-50 to-cyan-50"
    },
    {
      title: "Chat Recovery",
      description: "Never lose important conversations with our advanced chat rescue system that maintains continuity across all platforms.",
      icon: <Heart className="w-7 h-7" />,
      gradient: "from-rose-500 via-pink-500 to-purple-500",
      bgGradient: "from-rose-50 to-pink-50"
    }
  ];

  return (
    <section className="py-32 px-4 bg-white min-h-screen relative overflow-hidden">
      {/* Beautiful Background Elements */}
      <div className="absolute inset-0 opacity-60">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-200/40 to-cyan-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating Elements */}
        <div className="absolute top-32 right-1/4 w-4 h-4 bg-blue-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-40 left-1/4 w-6 h-6 bg-purple-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/3 left-1/6 w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
          {/* <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-lg border-2 border-blue-200/50 rounded-full px-8 py-3 mb-10 shadow-xl hover:shadow-2xl transition-all duration-300">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <span className="text-gray-700 font-bold text-lg">Powerful Features</span>
          </div> */}

          <h1 className="text-5xl font-black mb-8 text-gray-900 leading-tight">
            Customer Communication
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-blue-800 to-blue-950 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
            Experience the future of customer engagement with our comprehensive suite of
            communication tools designed to delight your customers and grow your business.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
              style={{
                animation: `slideInUp 0.8s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Card */}
              <div className={`relative bg-gradient-to-br ${feature.bgGradient} rounded-3xl p-8 shadow-sm border-2 border-white/60  hover:-translate-y-4 hover:scale-105 transition-all duration-500 backdrop-blur-sm overflow-hidden`}>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>

                {/* Icon Container */}
                <div className="relative mb-6 z-10">
                  <div className={`w-18 h-18 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mb-2`}>
                    <div className="text-white drop-shadow-lg">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Icon Glow */}
                  <div className={`absolute top-0 w-18 h-18 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-40 blur-xl transition-all duration-500`}></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-gray-700 transition-colors leading-tight">
                    {feature.title}
                  </h3>

                  <p className="text-gray-700 text-sm leading-relaxed font-medium group-hover:text-gray-800 transition-colors">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-100/70 to-purple-100/80 backdrop-blur-xl rounded-3xl p-16 border-2 border-white/60 shadow-sm transition-all duration-500">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Ready to Transform Your
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Customer Experience</span>?
              </h3>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium">
                Join thousands of businesses already using our platform to create meaningful customer connections and drive growth.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button  className='px-12 py-5 font-bold text-lg'>
                  <span className="relative z-10">Start Free Trial</span>
                </Button>

                <button className="bg-white hover:bg-[#3C4BFF] text-gray-900 hover:text-white px-12 py-5 rounded-2xl font-bold text-lg border-3 border-gray-200 hover:border-gray-300 shadow-xl  transition-all duration-300">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default FeatureContainer;