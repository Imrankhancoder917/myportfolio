"use client";

import React from "react";
import { motion } from "framer-motion";
import SectionContainer from "@/components/layout/SectionContainer";
import { CERTIFICATES } from "@/lib/constants/skills";
import { Award, ExternalLink, Download } from "lucide-react";

export default function CertificatesPage() {
  const certsByCategory = CERTIFICATES.reduce(
    (acc, cert) => {
      if (!acc[cert.category]) acc[cert.category] = [];
      acc[cert.category].push(cert);
      return acc;
    },
    {} as Record<string, typeof CERTIFICATES>,
  );

  return (
    <main>
      <SectionContainer className="pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Certifications & Credentials
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Professional certifications and credentials demonstrating expertise and continuous
            learning in cloud technologies, AI/ML, and modern development practices.
          </p>
        </motion.div>

        {/* Certificates by Category */}
        <div className="space-y-12">
          {Object.entries(certsByCategory).map(([category, certs], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-cyan-400" />
                {category}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certs.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <div className="relative h-full rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                      {/* Background accent */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <Award className="w-8 h-8 text-cyan-400" />
                          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold">
                            {cert.date}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                          {cert.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-4">{cert.issuer}</p>

                        {/* Links */}
                        <div className="flex gap-2 pt-4 border-t border-slate-700/50">
                          {cert.credentialUrl && (
                            <motion.a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-3 py-2 rounded text-xs bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-1"
                              whileHover={{ scale: 1.05 }}
                            >
                              <ExternalLink className="w-3 h-3" />
                              View
                            </motion.a>
                          )}
                          {cert.pdfUrl && (
                            <motion.a
                              href={cert.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-3 py-2 rounded text-xs bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 transition-all flex items-center justify-center gap-1"
                              whileHover={{ scale: 1.05 }}
                            >
                              <Download className="w-3 h-3" />
                              PDF
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </SectionContainer>
    </main>
  );
}
