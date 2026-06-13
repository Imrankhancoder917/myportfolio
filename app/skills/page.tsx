"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import SectionContainer from "@/components/layout/SectionContainer";
import SkillCard from "@/components/cards/SkillCard";
import { ALL_PROJECTS } from "@/lib/constants/projects";
import { SKILL_SECTIONS, SKILLS } from "@/lib/constants/skills";

export default function SkillsPage() {
  const projectTechCount = useMemo(() => {
    const uniqueTech = new Set<string>();

    ALL_PROJECTS.forEach((project) => {
      project.techStack.forEach((tech) => uniqueTech.add(tech));
    });

    return uniqueTech.size;
  }, []);

  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.10),_transparent_35%),linear-gradient(180deg,#f8fcff_0%,#f4fbf8_100%)] text-slate-900">
      <SectionContainer className="pt-10 sm:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 max-w-3xl"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
            Master skill set
          </p>
          <h1 className="mt-4 text-5xl font-serif font-semibold tracking-[-0.04em] text-slate-900 md:text-6xl">
            Skills & Capabilities
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A categorized, project-aligned view of the technologies, tooling, and fundamentals I
            use to build polished software products with the same premium light aesthetic as the
            Projects page.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {[
            { label: "Total skills", value: `${SKILLS.length}+` },
            { label: "Categories", value: `${SKILL_SECTIONS.length}` },
            { label: "Project technologies", value: `${projectTechCount}+` },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0 },
              }}
              className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_14px_42px_rgba(15,23,42,0.05)] backdrop-blur-xl"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                {stat.label}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="space-y-16">
          {SKILL_SECTIONS.map((section, sectionIndex) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                    {section.title}
                  </p>
                  <h2 className="mt-3 text-3xl font-serif font-semibold tracking-[-0.03em] text-slate-900">
                    {section.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    {section.description}
                  </p>
                </div>

                <div className="rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-600 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
                  {section.skills.length} skills
                </div>
              </div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-120px" }}
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.06,
                    },
                  },
                }}
                className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
              >
                {section.skills.map((skill, index) => (
                  <SkillCard key={skill.name} skill={skill} index={index} />
                ))}
              </motion.div>
            </motion.section>
          ))}
        </div>
      </SectionContainer>
    </main>
  );
}
