"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import TypewriterText from "@/components/shared/typewriter-text";
import TerminalHeader from "@/components/shared/terminal-header";
import ErrorBoundary from "@/components/shared/error-boundary";
import TriviaGame from "@/components/trivia-game";
import { LAYOUT, TECH_STACK, RESOURCES } from "@/lib/constants";

export default function Home() {
  const [isGameActive, setIsGameActive] = useState(false);

  const startGame = () => setIsGameActive(true);
  const stopGame = () => setIsGameActive(false);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
        <div className="relative z-10">
          <TerminalHeader />
          <HeroSection onStartGame={startGame} />
          <GameSection />
          <TechSection />
          <ResourcesSection />
          <ContactSection />
        </div>

        {/* Game Modal */}
        {isGameActive && <TriviaGame onStop={stopGame} />}
      </div>
    </ErrorBoundary>
  );
}

function HeroSection({ onStartGame }: { onStartGame: () => void }) {
  return (
    <section className={`max-w-${LAYOUT.MAX_WIDTH} mx-auto ${LAYOUT.PADDING}`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <TypewriterText
          text="VOICE AI TRIVIA GAME"
          className="text-4xl md:text-6xl font-bold mb-6 text-green-400"
          delay={0.5}
        />

        <TypewriterText
          text="// An AI-powered trivia experience"
          className="block text-xl text-green-400/70 mb-8"
          delay={2}
        />

        <SystemStatusPanel />
        <ActionButtons onStartGame={onStartGame} />
      </motion.div>
    </section>
  );
}

function SystemStatusPanel() {
  const statusItems = [
    { label: "AI Agent", status: "ONLINE", indicator: "●" },
    { label: "Voice Recognition", status: "ACTIVE", indicator: "●" },
    { label: "Real-time Processing", status: "ENABLED", indicator: "●" },
    { label: "LiveKit Connection", status: "READY", indicator: "●" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 3.5, duration: 0.5 }}
      className="bg-black/50 border border-green-400/30 rounded-lg p-6 max-w-2xl mx-auto mb-8 mt-8"
      role="status"
      aria-label="System Status Panel"
    >
      <div className="text-green-400 text-sm font-mono">
        <div className="border-b border-green-400/20 pb-2 mb-3">
          <span className="text-amber-400 font-bold">SYSTEM STATUS</span>
        </div>
        <div className="space-y-2">
          {statusItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-xs" aria-hidden="true">
                  {item.indicator}
                </span>
                <span className="text-green-400/90">{item.label}:</span>
              </div>
              <span
                className="text-green-400 font-bold"
                aria-label={`${item.label} status: ${item.status}`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-green-400/20 pt-2 mt-3 text-center">
          <span className="text-green-400/70 text-xs">
            All systems operational
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ActionButtons({ onStartGame }: { onStartGame: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 4, duration: 0.5 }}
      className="flex flex-col sm:flex-row gap-4 justify-center"
    >
      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)",
        }}
        whileTap={{ scale: 0.95 }}
        onClick={onStartGame}
        className="bg-green-400 text-black px-8 py-3 cursor-pointer rounded font-bold text-lg hover:bg-green-300 transition-all duration-200"
      >
        &gt; START GAME
      </motion.button>
      <Link
        href="https://github.com/mbarinov"
        target="_blank"
        rel="noopener noreferrer"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="border border-green-400 text-green-400 px-8 py-3 rounded font-bold text-lg hover:bg-green-400/10 transition-all duration-200 cursor-pointer"
        >
          &gt; GITHUB
        </motion.button>
      </Link>
    </motion.div>
  );
}

function GameSection() {
  return (
    <section className={`max-w-${LAYOUT.MAX_WIDTH} mx-auto ${LAYOUT.PADDING}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-8"
      >
        <GameFeatures />
        <GameTerminal />
      </motion.div>
    </section>
  );
}

function GameFeatures() {
  const features = [
    "Real-time voice interaction with AI trivia host",
    "Powered by LiveKit Agents & OpenAI Realtime API",
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-amber-400">
        &gt; game.initialize()
      </h2>
      <div className="space-y-4 text-green-400/80">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="text-amber-400 mt-1">▶</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GameTerminal() {
  return (
    <div className="bg-black/50 border border-green-400/30 rounded-lg p-4">
      <div className="text-green-400/70 text-sm mb-2">
        ~/demo $ voice-trivia --interactive
      </div>
      <pre className="text-green-400 text-xs">
        {`Initializing voice connection...
✓ Microphone access granted
✓ AI agent connected
✓ Audio pipeline ready

Ready for voice commands:
- "start game"
- "repeat question" 
- "what's my score"
- "next category"

Waiting for user input...
> _`}
      </pre>
    </div>
  );
}

function TechSection() {
  return (
    <section className={`max-w-${LAYOUT.MAX_WIDTH} mx-auto ${LAYOUT.PADDING}`}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold mb-8 text-amber-400">
          &gt; tech.stack --verbose
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECH_STACK.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-black/50 border border-green-400/30 rounded-lg p-4 hover:border-green-400/50 transition-colors"
            >
              <div className="text-green-400 font-bold mb-1">{tech.name}</div>
              <div className="text-green-400/70 text-sm">{tech.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ResourcesSection() {
  return (
    <section
      id="resources"
      className={`max-w-${LAYOUT.MAX_WIDTH} mx-auto ${LAYOUT.PADDING}`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold mb-8 text-amber-400">
          &gt; ls -la resources/
        </h2>

        <div className="bg-black/50 border border-green-400/30 rounded-lg p-6">
          <div className="text-green-400/70 text-sm mb-4">
            total {RESOURCES.length} directories
          </div>

          <div className="space-y-2">
            {RESOURCES.map((resource, index) => (
              <motion.a
                key={resource.name}
                href={resource.url}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-2 rounded hover:bg-green-400/10 transition-colors group cursor-pointer"
              >
                <span className="text-amber-400 group-hover:text-amber-300">
                  drwxr-xr-x
                </span>
                <span className="text-green-400 group-hover:text-green-300 font-bold min-w-[100px]">
                  {resource.name}/
                </span>
                <span className="text-green-400/70 group-hover:text-green-400">
                  {resource.icon} {resource.desc}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function ContactSection() {
  const contactInfo = [
    {
      label: "Email",
      value: "max@maxbarinov.com",
      link: "mailto:me@maxbarinov.com",
    },
    {
      label: "Website",
      value: "maxbarinov.com",
      link: "https://maxbarinov.com",
    },
    {
      label: "GitHub",
      value: "github.com/maxbarinov",
      link: "https://github.com/maxbarinov",
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/maxbarinov",
      link: "https://linkedin.com/in/maxbarinov",
    },
  ];

  const highlights = [
    "Founding Engineer",
    "Specializing in AI",
    "Open to collaboration & tech talks",
  ];

  return (
    <section className={`max-w-${LAYOUT.MAX_WIDTH} mx-auto ${LAYOUT.PADDING}`}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold mb-8 text-amber-400">
          &gt; contact.info
        </h2>

        <div
          className="bg-black/50 border border-green-400/30 rounded-lg p-6 max-w-2xl mx-auto"
          role="contentinfo"
          aria-label="Contact Information"
        >
          <div className="text-green-400 text-sm font-mono text-left">
            <div className="border-b border-green-400/20 pb-3 mb-4">
              <span className="text-amber-400 font-bold">
                CONTACT INFORMATION
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {contactInfo.map((contact, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-green-400/90 min-w-[80px]">
                    {contact.label}:
                  </span>
                  <a
                    href={contact.link}
                    className="text-green-400 hover:text-green-300 transition-colors underline decoration-green-400/30 hover:decoration-green-300"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${contact.label}: ${contact.value}`}
                  >
                    {contact.value}
                  </a>
                </div>
              ))}
            </div>

            <div className="border-t border-green-400/20 pt-3">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 mb-1">
                  <span className="text-amber-400" aria-hidden="true">
                    &gt;
                  </span>
                  <span className="text-green-400/90">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-green-400/70"
        >
          <TypewriterText text="EOF" className="text-amber-400" delay={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
