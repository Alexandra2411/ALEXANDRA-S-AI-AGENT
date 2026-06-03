import React from "react";
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Languages, CheckCircle } from "lucide-react";
import { CvData } from "../types";

interface CvOverviewProps {
  data: CvData;
  lang: "en" | "fr";
}

export const CvOverview: React.FC<CvOverviewProps> = ({ data, lang }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-white/10 text-white relative overflow-hidden shadow-2xl" id="cv-overview-container">
      {/* Decorative ambient background bubble */}
      <div className="absolute -right-24 -top-24 w-48 h-48 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-24 -bottom-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* CV Header */}
      <div className="border-b border-white/10 pb-6 mb-6">
        <span className="text-[10px] uppercase tracking-[0.4em] text-red-300 font-bold block mb-1">
          {lang === "fr" ? "PROFIL DU CANDIDAT" : "CANDIDATE DOSSIER"}
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-1" id="cv-name">{data.name}</h2>
        <p className="text-white/80 font-light text-base">{data.title}</p>

        {/* Contact Strip */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-mono text-white/60">
          <div className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone className="w-3.5 h-3.5 text-red-400" />
            <span>{data.contact.phone}</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail className="w-3.5 h-3.5 text-red-400" />
            <a href={`mailto:${data.contact.email}`} className="underline">
              {data.contact.email}
            </a>
          </div>
          <div className="flex items-center gap-1.5 hover:text-white transition-colors">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span>{data.contact.location}</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Experience Section */}
        <div>
          <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-red-300 font-bold mb-4">
            <Briefcase className="w-4 h-4" />
            <span>
              {lang === "fr" ? "Expériences Professionnelles" : "Professional Experience"}
            </span>
          </h3>
          <div className="space-y-5">
            {data.experiences.map((exp, idx) => (
              <div key={idx} className="group relative pl-4 before:absolute before:left-0 before:top-1.5 before:bottom-0 before:w-[2px] before:bg-red-400 hover:bg-white/5 p-3 rounded-2xl transition-all border border-transparent hover:border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="font-semibold text-white text-sm">{exp.title}</h4>
                  <span className="text-[10px] bg-red-500/20 text-red-200 border border-red-500/30 px-2.5 py-0.5 rounded-full font-mono font-medium self-start sm:self-center">
                    {exp.period}
                  </span>
                </div>
                <p className="text-xs text-white/60 font-medium mt-1">
                  {exp.subtitle} • {exp.location}
                </p>
                <ul className="mt-2.5 space-y-1 text-xs text-white/70 list-none">
                  {exp.details.map((detail, dIdx) => (
                    <li key={dIdx} className="leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1 preceding before:h-1 before:bg-red-400 before:rounded-full">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div>
          <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-red-300 font-bold mb-4">
            <GraduationCap className="w-4.5 h-4.5" />
            <span>{lang === "fr" ? "Formation" : "Education"}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.education.map((edu, idx) => (
              <div key={idx} className="border border-white/10 hover:border-red-400/40 rounded-2xl p-4 bg-white/5 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between gap-1.5">
                  <h4 className="font-semibold text-white text-xs">{edu.title}</h4>
                  <span className="text-[9px] font-mono text-red-300 bg-red-950/40 border border-red-900/50 px-2 py-0.5 rounded">
                    {edu.period}
                  </span>
                </div>
                <p className="text-xs text-red-300 mt-1">{edu.subtitle}</p>
                <p className="text-[10px] text-white/50 mt-1.5 font-mono">{edu.location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Competences and Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Competences */}
          <div>
            <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-red-300 font-bold mb-4">
              <CheckCircle className="w-4 h-4" />
              <span>{lang === "fr" ? "Compétences" : "Skills"}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-white/5 text-white/90 font-medium text-xs px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-red-300 font-bold mb-4">
              <Languages className="w-4 h-4" />
              <span>{lang === "fr" ? "Langues" : "Languages"}</span>
            </h3>
            <div className="space-y-2">
              {data.languages.map((l, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 pl-4">
                  <span className="font-semibold text-white">{l.name}</span>
                  <span className="text-white/60 font-mono text-[11px]">{l.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Association & Extracurricular Activities */}
        <div>
          <h3 className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-red-300 font-bold mb-4">
            <Award className="w-4 h-4" />
            <span>
              {lang === "fr" ? "Activités Extra-Professionnelles" : "Extracurriculars & Leadership"}
            </span>
          </h3>
          <div className="space-y-3.5">
            {data.extra.map((ex, idx) => (
              <div key={idx} className="text-xs p-4 bg-white/5 border border-white/5 hover:border-white/10 transition-all rounded-2xl leading-relaxed">
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="font-semibold text-red-200">{ex.category}</span>
                  {ex.period && (
                    <span className="font-mono text-[10px] text-white/50 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                      {ex.period}
                    </span>
                  )}
                </div>
                <p className="text-white/70 text-xs font-light leading-relaxed">{ex.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CvOverview;

