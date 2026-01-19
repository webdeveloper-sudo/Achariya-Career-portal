import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  GraduationCap,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Heart,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { jobService } from "../services/jobService";

import college from "../assets/college_campus_modern_1767347532376.png";
import school from "../assets/school_modern_classroom_1767347506078.png";
import corporate from "../assets/corporate_modern_office_1767347559347.png";
// import acahriyalogonew from "../assets/Achariya-Logo-01-scaled.avif";

export default function CareersHome() {
  const [counts, setCounts] = useState({
    School: 0,
    College: 0,
    Corporate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const jobs = await jobService.getAllJobs();
        setCounts({
          School: jobs.filter((j) => j.category === "School").length,
          College: jobs.filter((j) => j.category === "College").length,
          Corporate: jobs.filter((j) => j.category === "Corporate").length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  const getCount = (key: keyof typeof counts) => (loading ? "—" : counts[key]);

  const totalOpenings = counts.School + counts.College + counts.Corporate;

  return (
    <div className="min-h-screen font-sans text-gray-900 overflow-x-hidden">
      {/* ================= HEADER ================= */}

      <main className=" bg-white/70 container mx-auto">
        {/* ================= HERO ================= */}
        <section className="text-center pt-16 pb-10 md:px-0 px-4 max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Build Your Career with{" "}
            <span className="text-[#C72323]">ACHARIYA</span>
          </h1>
          <p className=" text-gray-600">
            Join a multi-institutional education group dedicated to shaping future leaders through a strong ecosystem that spans Schools, Colleges, and Corporate divisions, fostering academic excellence, practical skills, and industry-ready professionals.
          </p>
        </section>

          {/* ================= CATEGORIES ================= */}
        <section id="categories" className="max-w-7xl mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "School",
                img: school,
                icon: <Building2 />,
                desc: "Teaching & Non-Teaching roles",
                count: getCount("School"),
                link: "/school",
              },
              {
                title: "College",
                img: college,
                icon: <GraduationCap />,
                desc: "Faculty & Academic roles",
                count: getCount("College"),
                link: "/college",
              },
              {
                title: "Corporate",
                img: corporate,
                icon: <Briefcase />,
                desc: "Tech, HR & Management roles",
                count: getCount("Corporate"),
                link: "/corporate",
              },
            ].map((card, i) => (
              <Link
                to={card.link}
                key={i}
                className="group relative h-96 rounded-xl overflow-hidden shadow-xl hover:-translate-y-2 transition-all"
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <span className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full text-sm font-semibold shadow">
                  {card.count} Openings
                </span>

                <div className="absolute bottom-0 p-6 text-white">
                  <div className="w-12 h-12 bg-[#C72323] rounded-lg flex items-center justify-center mb-4">
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{card.title}</h3>
                  <p className="text-sm text-white/80 mb-4">{card.desc}</p>
                  <span className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-medium">
                    View Openings <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      

        <hr className="md:py-4 py-1 pb-12 container mx-12" />

        {/* ================= WHO WE ARE ================= */}
        <section className="max-w-4xl mx-auto text-center px-6 mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Who We Are <span className="text-[#C72323]">?</span>
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            ACHARIYA is committed to academic excellence, innovation, and
            inclusive growth. We empower educators, administrators, and
            professionals to build meaningful long-term careers.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm">
            {["Ethical Leadership", "Transparent Hiring", "Career Growth"].map(
              (item, i) => (
                <span key={i} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="text-green-600 w-5 h-5" />
                  {item}
                </span>
              )
            )}
          </div>
        </section>
          {/* ================= TRUST STATS ================= */}
        <section className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { label: "Institutions", value: "36+" },
            { label: "Employees", value: "2500+" },
            { label: "Years of Excellence", value: "25+" },
            { label: "Open Positions", value: totalOpenings },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border shadow-sm py-8 text-center hover:shadow-md transition"
            >
              <p className="text-3xl font-extrabold text-[#C72323]">
                {loading ? "—" : item.value}
              </p>
              <p className="text-sm text-gray-600 mt-2">{item.label}</p>
            </div>
          ))}
        </section>

      
        {/* ================= CTA ================= */}
        <section className="py-20 text-center bg-gradient-to-r from-[#C72323] to-red-700 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Shape the Future?
          </h2>
          <p className="max-w-xl mx-auto mb-8 text-white/90">
            Explore opportunities and become part of a growing education
            ecosystem.
          </p>
          <button
            onClick={() =>
              document
                .getElementById("categories")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-white text-[#C72323] px-8 py-4 rounded-full font-semibold hover:scale-105 transition"
          >
            View All Openings
          </button>
        </section>

        {/* ================= WHY CHOOSE US ================= */}
        <section className="bg-white/70 py-20">
          <div className="max-w-6xl bg-white/70 mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose ACHARIYA <span className="text-[#C72323]">?</span>
            </h2>

            <div className="bg-white/70 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Heart />,
                  title: "Inclusive Culture",
                  desc: "Respect, diversity, and collaboration at every level.",
                },
                {
                  icon: <TrendingUp />,
                  title: "Career Growth",
                  desc: "Clear pathways, learning programs, and mentorship.",
                },
                {
                  icon: <Zap />,
                  title: "Impactful Work",
                  desc: "Contribute to meaningful education initiatives.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/70 border border-gray-300 p-8 rounded-xl shadow-sm hover:shadow-md transition text-center"
                >
                  <div className="w-12 h-12 mx-auto bg-[#C72323]/10 text-[#C72323] rounded-full flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-400 py-10 text-center">
        <p className="text-white font-semibold mb-2">ACHARIYA Careers</p>
        <p className="text-sm">
          © {new Date().getFullYear()} Achariya Group. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
