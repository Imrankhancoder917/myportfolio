"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import ProjectCard from "@/components/cards/ProjectCard";
import SectionContainer from "@/components/layout/SectionContainer";
import portfolioData from "@/data/portfolio.json";
import { Project } from "@/lib/types/projects";

const ALL_PROJECTS = portfolioData.projects as unknown as Project[];
const FEATURED_PROJECTS = ALL_PROJECTS.filter((p: Project) => p.featured);

export default function ProjectsPage() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      ALL_PROJECTS.forEach((project) => {
        console.log(project.title);
        console.log(project.image);
      });
    }
  }, []);

  const orderedProjects = [
    ...FEATURED_PROJECTS,
    ...ALL_PROJECTS.filter((project) => !project.featured),
  ];

  const otherProjects = ALL_PROJECTS.filter((project) => !project.featured);

  return (
    <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.10),_transparent_35%),linear-gradient(180deg,#f8fcff_0%,#f4fbf8_100%)] text-slate-900">
      <SectionContainer className="pt-10 sm:pt-12 pb-10 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 max-w-3xl"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
            Selected work
          </p>
          <h1 className="mt-4 text-5xl md:text-6xl font-serif font-semibold tracking-[-0.04em] text-slate-900">
            Projects & Case Studies
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A collection of real-world software projects showcasing full-stack development, backend engineering, AI integration, and scalable system design. Each project reflects practical problem-solving, clean architecture, and modern development practices.
          </p>
        </motion.div>

        <section className="mb-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                Featured Projects
              </p>
              <h2 className="mt-3 text-3xl font-serif font-semibold tracking-[-0.03em] text-slate-900">
                Software Showcase
              </h2>
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
                  staggerChildren: 0.12,
                },
              },
            }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            {FEATURED_PROJECTS.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} featured />
            ))}
          </motion.div>
        </section>

        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                All Projects
              </p>
              <h2 className="mt-3 text-3xl font-serif font-semibold tracking-[-0.03em] text-slate-900">
                All Projects
              </h2>
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
                  staggerChildren: 0.09,
                },
              },
            }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            {orderedProjects.map((project, index) => (
              <ProjectCard key={`${project.id}-${index}`} project={project} index={index} featured={project.featured} />
            ))}
          </motion.div>

          {otherProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <p className="text-xl text-slate-500">No additional projects are available yet.</p>
            </motion.div>
          )}
        </section>
      </SectionContainer>
    </main>
  );
}
