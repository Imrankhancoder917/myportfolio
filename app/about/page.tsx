"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionContainer from "@/components/layout/SectionContainer";
import { TIMELINE } from "@/lib/constants/skills";
import { Download, Briefcase, BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <main>
      <SectionContainer className="pt-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About Me
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
            I&apos;m a passionate software engineer and AI developer with a deep interest in building
            scalable systems, crafting elegant solutions, and pushing the boundaries of what&apos;s
            possible with modern technology. With a strong foundation in computer science and
            hands-on experience across the full stack, I thrive in solving complex problems and
            creating impactful digital experiences.
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.a
            href="/resume.pdf"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5" />
            Download Resume
          </motion.a>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-white mb-12 flex items-center gap-3">
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
            Journey & Milestones
          </h2>

          {TIMELINE.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-transparent transform md:-translate-x-1/2" />

              {/* Timeline items */}
              <div className="space-y-12">
                {TIMELINE.map((item: { type: string; date: string; title: string; description: string }, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className={`flex gap-8 md:gap-0 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                  >
                    {/* Content */}
                    <div className="flex-1 md:w-1/2 md:pr-12">
                      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-cyan-500/50 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                          {item.type === "work" ? (
                            <Briefcase className="w-5 h-5 text-cyan-400" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-purple-400" />
                          )}
                          <span className="text-sm font-semibold text-slate-400 uppercase">
                            {item.date}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-slate-300">{item.description}</p>
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="flex justify-center md:w-auto">
                      <motion.div
                        className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 border-4 border-slate-900 absolute left-[-9px] md:relative md:left-0"
                        whileInView={{ scale: [1, 1.5, 1] }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 px-6 rounded-lg border border-slate-700/50 bg-slate-800/30"
            >
              <p className="text-lg text-slate-400">No timeline added yet</p>
              <p className="text-slate-500 text-sm">Add your timeline in `/lib/constants/skills.ts`</p>
            </motion.div>
          )}
        </motion.div>

        {/* Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: "Years Experience", value: "5+" },
            { label: "Projects Completed", value: "30+" },
            { label: "Technologies", value: "20+" },
            { label: "Happy Clients", value: "15+" },
          ].map((stat, i) => (
            <div
              key={i}
              className="relative rounded-lg border border-slate-700/50 bg-slate-800/30 p-6 text-center hover:border-cyan-500/50 transition-all"
            >
              <p className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </SectionContainer>
    </main>
  );
}
