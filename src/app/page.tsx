import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { insforge, type Project, type Skill, type WorkExperience } from "@/lib/insforge";
import { siteConfig } from "@/config/site";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export default async function Home() {
  // Fetch all necessary data on the server concurrently
  const [settingsRes, skillsRes, experienceRes, projectsRes] = await Promise.all([
    insforge.database.from("site_settings").select("avatar_url").limit(1).single(),
    insforge.database.from("skills").select("*").order("sort_order", { ascending: true }),
    insforge.database.from("work_experience").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
    insforge.database.from("projects").select("*").eq("is_published", true).order("order_index", { ascending: true }).order("created_at", { ascending: false }),
  ]);

  const resumeUrl = siteConfig.resumeUrl || null;
  const avatarUrl = settingsRes.data?.avatar_url || siteConfig.avatarUrl || null;
  const skills: Skill[] = skillsRes.data || [];
  const experiences: WorkExperience[] = experienceRes.data || [];
  const projects: Project[] = projectsRes.data || [];
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <Navbar />
      <main>
        <Hero resumeUrl={resumeUrl} />
        <About skills={skills} avatar={avatarUrl} />
        <Experience experiences={experiences} />
        <Projects initialProjects={projects} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
