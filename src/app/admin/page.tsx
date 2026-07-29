"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { insforge, type Project, type ContactSubmission, type WorkExperience, type Skill, type SiteSettings } from "@/lib/insforge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogOut, Plus, Save, GripVertical } from "lucide-react";
import { Reorder } from "framer-motion";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { SingleImageUpload, MultiImageUpload } from "@/components/ui/image-upload";
import { SingleFileUpload } from "@/components/ui/file-upload";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // States for data
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactSubmission[]>([]);
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // States for Add/Edit Project
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectCover, setNewProjectCover] = useState("");
  const [newProjectImages, setNewProjectImages] = useState<string[]>([]);
  const [newProjectContent, setNewProjectContent] = useState("");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isOrderDirty, setIsOrderDirty] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // States for Add/Edit Experience
  const [isAddExperienceOpen, setIsAddExperienceOpen] = useState(false);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);

  // States for Add/Edit Skill
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await insforge.auth.getCurrentUser();
        if (!user) {
          router.push("/admin/login");
          return;
        }
        
        if (user.email !== "mahmudizukri@gmail.com") {
          toast.error("Unauthorized. Only mahmudizukri@gmail.com can access the dashboard.");
          await insforge.auth.signOut();
          router.push("/admin/login");
          return;
        }

        setUser(user);
        
        await Promise.allSettled([
          fetchProjects(), 
          fetchMessages(),
          fetchExperiences(),
          fetchSkills(),
          fetchSettings()
        ]);
      } catch (err) {
        console.error("Failed to load admin data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchProjects = async () => {
    const { data, error } = await insforge.database.from("projects").select("*").order("order_index", { ascending: true }).order("created_at", { ascending: false });
    if (!error && data) {
      setProjects(data);
      setIsOrderDirty(false);
    }
  };

  const fetchMessages = async () => {
    const { data, error } = await insforge.database.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      setMessages(data);
    }
  };

  const fetchExperiences = async () => {
    const { data } = await insforge.database.from("work_experience").select("*").order("sort_order", { ascending: true });
    if (data) setExperiences(data);
  };

  const fetchSkills = async () => {
    const { data } = await insforge.database.from("skills").select("*").order("category", { ascending: true }).order("sort_order", { ascending: true });
    if (data) setSkills(data);
  };

  const fetchSettings = async () => {
    const { data } = await insforge.database.from("site_settings").select("*").limit(1).single();
    if (data) setSettings(data);
  };

  const handleSignOut = async () => {
    await insforge.auth.signOut();
    router.push("/admin/login");
  };

  const handleAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAddingProject(true);
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const demo_url = formData.get("demo_url") as string;
    const github_url = formData.get("github_url") as string;
    const cover_image = formData.get("cover_image") as string;
    const imagesString = formData.get("images") as string;
    const images = imagesString ? imagesString.split(",").map(i => i.trim()).filter(Boolean) : null;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [];
    const is_published = formData.get("is_published") === "on";
    const order_index = projects.length;

    try {
      const { error } = await insforge.database.from("projects").insert([{
        title, slug, description, content, demo_url, github_url, cover_image, images, tags, order_index, is_published
      }]);

      if (error) throw error;
      
      toast.success("Project added successfully!");
      setIsAddProjectOpen(false);
      fetchProjects();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to add project");
    } finally {
      setIsAddingProject(false);
    }
  };

  const handleAddExperience = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAddingExperience(true);
    
    const formData = new FormData(e.currentTarget);
    const company = formData.get("company") as string;
    const role = formData.get("role") as string;
    const date_range = formData.get("date_range") as string;
    const achievementsString = formData.get("achievements") as string;
    const achievements = achievementsString.split('\n').map(a => a.trim()).filter(Boolean);
    const sort_order = parseInt(formData.get("sort_order") as string) || 0;

    try {
      const { error } = await insforge.database.from("work_experience").insert([{
        company, role, date_range, achievements, sort_order
      }]);

      if (error) throw error;
      
      toast.success("Experience added successfully!");
      setIsAddExperienceOpen(false);
      fetchExperiences();
    } catch (err: any) {
      toast.error(err.message || "Failed to add experience");
    } finally {
      setIsAddingExperience(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAddingSkill(true);
    
    const formData = new FormData(e.currentTarget);
    const category = formData.get("category") as string;
    const name = formData.get("name") as string;
    const level = parseInt(formData.get("level") as string) || 0;
    const sort_order = parseInt(formData.get("sort_order") as string) || 0;

    try {
      const { error } = await insforge.database.from("skills").insert([{
        category, name, level, sort_order
      }]);

      if (error) throw error;
      
      toast.success("Skill added successfully!");
      setIsAddSkillOpen(false);
      fetchSkills();
    } catch (err: any) {
      toast.error(err.message || "Failed to add skill");
    } finally {
      setIsAddingSkill(false);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsAddingProject(true);
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const demo_url = formData.get("demo_url") as string;
    const github_url = formData.get("github_url") as string;
    const cover_image = formData.get("cover_image") as string;
    const imagesString = formData.get("images") as string;
    const images = imagesString ? imagesString.split(",").map(i => i.trim()).filter(Boolean) : null;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [];
    const is_published = formData.get("is_published") === "on";

    try {
      const { error } = await insforge.database.from("projects").update({
        title, slug, description, content, demo_url, github_url, cover_image, images, tags, is_published
      }).eq("id", editingProject.id);

      if (error) throw error;
      
      toast.success("Project updated successfully!");
      setEditingProject(null);
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to update project");
    } finally {
      setIsAddingProject(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const { error } = await insforge.database.from("projects").delete().eq("id", id);
      if (error) throw error;
      toast.success("Project deleted successfully!");
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete project");
    }
  };

  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    try {
      await Promise.all(
        projects.map((p, index) => 
          insforge.database.from("projects").update({ order_index: index }).eq("id", p.id)
        )
      );
      toast.success("Order saved successfully!");
      setIsOrderDirty(false);
      fetchProjects();
    } catch (err: any) {
      toast.error("Failed to save order");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleUpdateExperience = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingExperience) return;
    setIsAddingExperience(true);
    
    const formData = new FormData(e.currentTarget);
    const company = formData.get("company") as string;
    const role = formData.get("role") as string;
    const date_range = formData.get("date_range") as string;
    const achievementsString = formData.get("achievements") as string;
    const achievements = achievementsString.split('\n').map(a => a.trim()).filter(Boolean);
    const sort_order = parseInt(formData.get("sort_order") as string) || 0;

    try {
      const { error } = await insforge.database.from("work_experience").update({
        company, role, date_range, achievements, sort_order
      }).eq("id", editingExperience.id);

      if (error) throw error;
      
      toast.success("Experience updated successfully!");
      setEditingExperience(null);
      fetchExperiences();
    } catch (err: any) {
      toast.error(err.message || "Failed to update experience");
    } finally {
      setIsAddingExperience(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      const { error } = await insforge.database.from("work_experience").delete().eq("id", id);
      if (error) throw error;
      toast.success("Experience deleted successfully!");
      fetchExperiences();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete experience");
    }
  };

  const handleUpdateSkill = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSkill) return;
    setIsAddingSkill(true);
    
    const formData = new FormData(e.currentTarget);
    const category = formData.get("category") as string;
    const name = formData.get("name") as string;
    const level = parseInt(formData.get("level") as string) || 0;
    const sort_order = parseInt(formData.get("sort_order") as string) || 0;

    try {
      const { error } = await insforge.database.from("skills").update({
        category, name, level, sort_order
      }).eq("id", editingSkill.id);

      if (error) throw error;
      
      toast.success("Skill updated successfully!");
      setEditingSkill(null);
      fetchSkills();
    } catch (err: any) {
      toast.error(err.message || "Failed to update skill");
    } finally {
      setIsAddingSkill(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      const { error } = await insforge.database.from("skills").delete().eq("id", id);
      if (error) throw error;
      toast.success("Skill deleted successfully!");
      fetchSkills();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete skill");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const avatar_url = formData.get("avatar_url") as string;
    const resume_url = formData.get("resume_url") as string;
    
    try {
      if (settings?.id) {
        await insforge.database.from("site_settings").update({ avatar_url, resume_url }).eq("id", settings.id);
      } else {
        await insforge.database.from("site_settings").insert([{ avatar_url, resume_url }]);
      }
      toast.success("Settings saved!");
      fetchSettings();
    } catch (err) {
      toast.error("Failed to save settings");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-primary">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-primary font-bold text-sm mt-1">Logged in as {user?.email}</p>
        </div>
        <Button variant="outline" className="border-2 border-primary shadow-[2px_2px_0_0_#000] rounded-none active:translate-y-px active:shadow-none" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="bg-card border-2 border-primary shadow-[4px_4px_0_0_#000] rounded-none mb-8 flex flex-wrap h-auto">
          <TabsTrigger value="messages" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">Messages</TabsTrigger>
          <TabsTrigger value="projects" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">Projects</TabsTrigger>
          <TabsTrigger value="experience" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">Experience</TabsTrigger>
          <TabsTrigger value="skills" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">Skills</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="messages" className="space-y-4">
          <h2 className="text-xl font-bold text-foreground mb-4">Contact Submissions</h2>
          {messages.length === 0 ? (
            <p className="text-foreground/60 font-bold">No messages yet.</p>
          ) : (
            <div className="grid gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className="p-4 bg-card border-2 border-primary shadow-[4px_4px_0_0_#000]">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-foreground text-lg">{msg.name}</h3>
                    <span className="text-xs text-foreground/50 font-bold">{new Date(msg.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-primary mb-2 font-bold">{msg.email}</p>
                  <p className="text-foreground/80 whitespace-pre-wrap mt-2">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="projects">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Projects</h2>
            <Dialog open={isAddProjectOpen} onOpenChange={(open) => {
              setIsAddProjectOpen(open);
              if (!open) {
                setNewProjectCover("");
                setNewProjectImages([]);
                setNewProjectContent("");
              }
            }}>
              <DialogTrigger className="inline-flex items-center justify-center h-10 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all font-medium text-sm">
                <Plus className="w-4 h-4 mr-2" /> Add Project
              </DialogTrigger>
              <DialogContent className="max-w-5xl bg-card border-2 border-primary shadow-[8px_8px_0_0_#000] rounded-none max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-foreground">Add New Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddProject} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary uppercase tracking-wider">Title *</label>
                      <Input name="title" required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" placeholder="My Awesome App" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary uppercase tracking-wider">Slug *</label>
                      <Input name="slug" required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" placeholder="my-awesome-app" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-wider">Short Description *</label>
                    <Input name="description" required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" placeholder="A brief summary of what this is" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-wider">Content (Markdown)</label>
                    <div className="grid grid-cols-2 gap-4 h-[300px]">
                      <Textarea name="content" value={newProjectContent} onChange={(e) => setNewProjectContent(e.target.value)} className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000] h-full resize-none font-mono text-sm p-4" placeholder="# My Project\n\nDetailed explanation..." />
                      <div className="bg-background border-2 border-primary shadow-[2px_2px_0_0_#000] h-full overflow-y-auto p-4 prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-a:font-bold">
                        {newProjectContent ? <ReactMarkdown>{newProjectContent}</ReactMarkdown> : <span className="text-muted-foreground/50 italic">Live preview...</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-wider">Tags (Comma Separated)</label>
                    <Input name="tags" className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" placeholder="React, Flutter, InsForge" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary uppercase tracking-wider">Demo / Play Store URL</label>
                      <Input name="demo_url" type="url" className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" placeholder="https://..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary uppercase tracking-wider">GitHub URL</label>
                      <Input name="github_url" type="url" className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" placeholder="https://github.com/..." />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-wider">Cover Image</label>
                    <SingleImageUpload name="cover_image" value={newProjectCover} onChange={setNewProjectCover} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-wider">Gallery Images</label>
                    <MultiImageUpload name="images" value={newProjectImages} onChange={setNewProjectImages} />
                  </div>
                  


                  <div className="flex items-center space-x-2 pt-2">
                    <input type="checkbox" name="is_published" id="is_published" defaultChecked className="w-4 h-4 rounded-none border-2 border-primary accent-primary" />
                    <label htmlFor="is_published" className="text-sm font-bold text-foreground">Publish immediately (disable for drafts)</label>
                  </div>
                  
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddProjectOpen(false)} className="rounded-none border-2 border-primary shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none">Cancel</Button>
                    <Button type="submit" disabled={isAddingProject} className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all">
                      {isAddingProject ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Save Project
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {isOrderDirty && (
            <div className="flex justify-end mb-4">
              <Button onClick={handleSaveOrder} disabled={isSavingOrder} className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all">
                {isSavingOrder ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save New Order
              </Button>
            </div>
          )}
          {projects.length === 0 ? (
            <p className="text-foreground/60 font-bold">No projects found. Add one to get started.</p>
          ) : (
            <Reorder.Group axis="y" values={projects} onReorder={(newOrder) => { setProjects(newOrder); setIsOrderDirty(true); }} className="grid gap-4">
              {projects.map((proj) => (
                <Reorder.Item key={proj.id} value={proj} className={`p-4 border-2 border-primary shadow-[4px_4px_0_0_#000] flex justify-between items-center ${proj.is_published ? 'bg-card' : 'bg-background opacity-80'}`}>
                  <div className="flex items-center gap-4">
                    <div className="cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-6 h-6 text-foreground/50 hover:text-foreground transition-colors" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-foreground text-lg">{proj.title}</h3>
                        {!proj.is_published && <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-xs font-bold uppercase border border-zinc-600 rounded-sm">Draft</span>}
                      </div>
                      <p className="text-sm text-primary mb-2 font-bold">{proj.slug}</p>
                    </div>
                  </div>
                  <div className="space-x-2 flex items-center">
                    <Dialog open={editingProject?.id === proj.id} onOpenChange={(open) => !open && setEditingProject(null)}>
                      <DialogTrigger onClick={() => setEditingProject(proj)} className="inline-flex items-center justify-center h-9 px-3 bg-card text-card-foreground border-2 border-primary rounded-none shadow-[2px_2px_0_0_#000] hover:bg-primary/20 active:translate-y-px active:shadow-none font-medium text-sm">
                        Edit
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl bg-card border-2 border-primary shadow-[8px_8px_0_0_#000] rounded-none max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold text-foreground">Edit Project</DialogTitle>
                        </DialogHeader>
                        {editingProject && (
                          <form onSubmit={handleUpdateProject} className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-primary uppercase tracking-wider">Title *</label>
                                <Input name="title" defaultValue={editingProject.title} required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-primary uppercase tracking-wider">Slug *</label>
                                <Input name="slug" defaultValue={editingProject.slug} required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-primary uppercase tracking-wider">Short Description *</label>
                              <Input name="description" defaultValue={editingProject.description} required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-primary uppercase tracking-wider">Content (Markdown)</label>
                              <div className="grid grid-cols-2 gap-4 h-[300px]">
                                <Textarea name="content" value={editingProject.content || ""} onChange={(e) => setEditingProject({...editingProject, content: e.target.value})} className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000] h-full resize-none font-mono text-sm p-4" />
                                <div className="bg-background border-2 border-primary shadow-[2px_2px_0_0_#000] h-full overflow-y-auto p-4 prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-a:font-bold">
                                  {editingProject.content ? <ReactMarkdown>{editingProject.content}</ReactMarkdown> : <span className="text-muted-foreground/50 italic">Live preview...</span>}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-primary uppercase tracking-wider">Tags (Comma Separated)</label>
                              <Input name="tags" defaultValue={editingProject.tags?.join(", ")} className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-primary uppercase tracking-wider">Demo / Play Store URL</label>
                                <Input name="demo_url" type="url" defaultValue={editingProject.demo_url || ""} className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-primary uppercase tracking-wider">GitHub URL</label>
                                <Input name="github_url" type="url" defaultValue={editingProject.github_url || ""} className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-primary uppercase tracking-wider">Cover Image</label>
                              <SingleImageUpload 
                                name="cover_image" 
                                value={editingProject.cover_image || ""} 
                                onChange={(url) => setEditingProject({...editingProject, cover_image: url})} 
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-primary uppercase tracking-wider">Gallery Images</label>
                              <MultiImageUpload 
                                name="images" 
                                value={editingProject.images || []} 
                                onChange={(urls) => setEditingProject({...editingProject, images: urls})} 
                              />
                            </div>
                            


                            <div className="flex items-center space-x-2 pt-2">
                              <input type="checkbox" name="is_published" id={`is_published-${editingProject.id}`} defaultChecked={editingProject.is_published} className="w-4 h-4 rounded-none border-2 border-primary accent-primary" />
                              <label htmlFor={`is_published-${editingProject.id}`} className="text-sm font-bold text-foreground">Publish project (disable for drafts)</label>
                            </div>
                            
                            <DialogFooter className="pt-4">
                              <Button type="button" variant="outline" onClick={() => setEditingProject(null)} className="rounded-none border-2 border-primary shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none">Cancel</Button>
                              <Button type="submit" disabled={isAddingProject} className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all">
                                {isAddingProject ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Update Project
                              </Button>
                            </DialogFooter>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteProject(proj.id)} className="border-2 border-destructive rounded-none shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none">Delete</Button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </TabsContent>

        <TabsContent value="experience">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Work Experience</h2>
            <Dialog open={isAddExperienceOpen} onOpenChange={setIsAddExperienceOpen}>
              <DialogTrigger className="inline-flex items-center justify-center h-10 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all font-medium text-sm">
                <Plus className="w-4 h-4 mr-2" /> Add Experience
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card border-2 border-primary shadow-[8px_8px_0_0_#000] rounded-none max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-foreground">Add Work Experience</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddExperience} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary uppercase tracking-wider">Company *</label>
                      <Input name="company" required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" placeholder="Acme Corp" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary uppercase tracking-wider">Role *</label>
                      <Input name="role" required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" placeholder="Senior Developer" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary uppercase tracking-wider">Date Range *</label>
                      <Input name="date_range" required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" placeholder="Jan 2022 - Present" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary uppercase tracking-wider">Sort Order</label>
                      <Input name="sort_order" type="number" defaultValue="0" className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-wider">Achievements (One per line) *</label>
                    <Textarea name="achievements" required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000] min-h-[150px]" placeholder="Built a highly scalable backend...&#10;Led a team of 5 engineers..." />
                  </div>
                  
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddExperienceOpen(false)} className="rounded-none border-2 border-primary shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none">Cancel</Button>
                    <Button type="submit" disabled={isAddingExperience} className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all">
                      {isAddingExperience ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Save Experience
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {experiences.length === 0 ? (
              <p className="text-foreground/60 font-bold">No experience entries found.</p>
            ) : (
              experiences.map((exp) => (
                <div key={exp.id} className="p-4 bg-card border-2 border-primary shadow-[4px_4px_0_0_#000] flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-foreground text-lg">{exp.role} @ {exp.company}</h3>
                    <p className="text-sm text-primary mb-2 font-bold">{exp.date_range}</p>
                    <ul className="list-disc pl-5 text-sm text-foreground/80">
                      {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                    </ul>
                  </div>
                  <div className="space-x-2 flex items-center ml-4 shrink-0">
                    <Dialog open={editingExperience?.id === exp.id} onOpenChange={(open) => !open && setEditingExperience(null)}>
                      <DialogTrigger onClick={() => setEditingExperience(exp)} className="inline-flex items-center justify-center h-9 px-3 bg-card text-card-foreground border-2 border-primary rounded-none shadow-[2px_2px_0_0_#000] hover:bg-primary/20 active:translate-y-px active:shadow-none font-medium text-sm">
                        Edit
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-card border-2 border-primary shadow-[8px_8px_0_0_#000] rounded-none max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold text-foreground">Edit Work Experience</DialogTitle>
                        </DialogHeader>
                        {editingExperience && (
                          <form onSubmit={handleUpdateExperience} className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-primary uppercase tracking-wider">Company *</label>
                                <Input name="company" defaultValue={editingExperience.company} required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-primary uppercase tracking-wider">Role *</label>
                                <Input name="role" defaultValue={editingExperience.role} required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-primary uppercase tracking-wider">Date Range *</label>
                                <Input name="date_range" defaultValue={editingExperience.date_range} required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-primary uppercase tracking-wider">Sort Order</label>
                                <Input name="sort_order" type="number" defaultValue={editingExperience.sort_order} className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-sm font-bold text-primary uppercase tracking-wider">Achievements (One per line) *</label>
                              <Textarea name="achievements" defaultValue={editingExperience.achievements.join("\n")} required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000] min-h-[150px]" />
                            </div>
                            
                            <DialogFooter className="pt-4">
                              <Button type="button" variant="outline" onClick={() => setEditingExperience(null)} className="rounded-none border-2 border-primary shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none">Cancel</Button>
                              <Button type="submit" disabled={isAddingExperience} className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all">
                                {isAddingExperience ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                Update Experience
                              </Button>
                            </DialogFooter>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteExperience(exp.id)} className="border-2 border-destructive rounded-none shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none">Delete</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Skills</h2>
            <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
              <DialogTrigger className="inline-flex items-center justify-center h-10 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all font-medium text-sm">
                <Plus className="w-4 h-4 mr-2" /> Add Skill
              </DialogTrigger>
              <DialogContent className="max-w-md bg-card border-2 border-primary shadow-[8px_8px_0_0_#000] rounded-none">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-foreground">Add Skill</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddSkill} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-wider">Category *</label>
                    <select name="category" required className="w-full h-10 px-3 bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]">
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="tools">Tools & Others</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary uppercase tracking-wider">Skill Name *</label>
                    <Input name="name" required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" placeholder="e.g. Flutter" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary uppercase tracking-wider">Level (0-100)</label>
                      <Input name="level" type="number" min="0" max="100" defaultValue="80" className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary uppercase tracking-wider">Sort Order</label>
                      <Input name="sort_order" type="number" defaultValue="0" className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                    </div>
                  </div>
                  
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddSkillOpen(false)} className="rounded-none border-2 border-primary shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none">Cancel</Button>
                    <Button type="submit" disabled={isAddingSkill} className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all">
                      {isAddingSkill ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                      Save Skill
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {['frontend', 'backend', 'tools'].map(cat => (
              <div key={cat} className="p-4 bg-card border-2 border-primary shadow-[4px_4px_0_0_#000]">
                <h3 className="font-bold text-primary uppercase mb-2">{cat}</h3>
                <div className="flex flex-col gap-2">
                  {skills.filter(s => s.category === cat).map(skill => (
                    <div key={skill.id} className="flex justify-between items-center p-2 bg-background border border-primary">
                      <span className="text-xs font-bold">{skill.name} ({skill.level})</span>
                      <div className="flex space-x-2">
                        <Dialog open={editingSkill?.id === skill.id} onOpenChange={(open) => !open && setEditingSkill(null)}>
                          <DialogTrigger onClick={() => setEditingSkill(skill)} className="inline-flex items-center justify-center h-6 px-2 text-[10px] bg-card text-card-foreground border-2 border-primary rounded-none shadow-[2px_2px_0_0_#000] hover:bg-primary/20 active:translate-y-px active:shadow-none font-medium">
                            Edit
                          </DialogTrigger>
                          <DialogContent className="max-w-md bg-card border-2 border-primary shadow-[8px_8px_0_0_#000] rounded-none">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-bold text-foreground">Edit Skill</DialogTitle>
                            </DialogHeader>
                            {editingSkill && (
                              <form onSubmit={handleUpdateSkill} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Category *</label>
                                  <select name="category" defaultValue={editingSkill.category} required className="w-full h-10 px-3 bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]">
                                    <option value="frontend">Frontend</option>
                                    <option value="backend">Backend</option>
                                    <option value="tools">Tools & Others</option>
                                  </select>
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Skill Name *</label>
                                  <Input name="name" defaultValue={editingSkill.name} required className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-bold text-primary uppercase tracking-wider">Level (0-100)</label>
                                    <Input name="level" type="number" min="0" max="100" defaultValue={editingSkill.level} className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-bold text-primary uppercase tracking-wider">Sort Order</label>
                                    <Input name="sort_order" type="number" defaultValue={editingSkill.sort_order} className="bg-background border-2 border-primary rounded-none focus-visible:ring-0 focus-visible:border-black shadow-[2px_2px_0_0_#000]" />
                                  </div>
                                </div>
                                
                                <DialogFooter className="pt-4 flex justify-between items-center w-full">
                                  <Button type="button" variant="destructive" onClick={() => { setEditingSkill(null); handleDeleteSkill(skill.id); }} className="rounded-none border-2 border-destructive shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none">Delete</Button>
                                  <div className="space-x-2 flex">
                                    <Button type="button" variant="outline" onClick={() => setEditingSkill(null)} className="rounded-none border-2 border-primary shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none">Cancel</Button>
                                    <Button type="submit" disabled={isAddingSkill} className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all">
                                      {isAddingSkill ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                      Update
                                    </Button>
                                  </div>
                                </DialogFooter>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <h2 className="text-xl font-bold text-foreground mb-6">Site Settings</h2>
          <div className="p-6 bg-card border-2 border-primary shadow-[4px_4px_0_0_#000] max-w-2xl">
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Avatar Image</label>
                  <SingleImageUpload 
                    name="avatar_url" 
                    value={settings?.avatar_url || ""} 
                    onChange={(url) => setSettings(settings ? { ...settings, avatar_url: url } : { avatar_url: url, resume_url: null, id: '' } as SiteSettings)} 
                  />
                  <p className="text-xs text-foreground/60">Leave blank to use the default 'MZ' dummy avatar.</p>
                </div>
                
                <div className="space-y-2 pt-4 border-t-2 border-primary">
                  <label className="text-sm font-bold text-primary uppercase tracking-wider">Resume (PDF)</label>
                  <SingleFileUpload 
                    name="resume_url" 
                    value={settings?.resume_url || ""} 
                    onChange={(url) => setSettings(settings ? { ...settings, resume_url: url } : { avatar_url: null, resume_url: url, id: '' } as SiteSettings)}
                    label="Upload PDF Resume"
                    accept="application/pdf"
                  />
                  <p className="text-xs text-foreground/60">This file will be available for download in the Hero section.</p>
                </div>
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-black rounded-none shadow-[4px_4px_0_0_#000] active:translate-y-1 active:shadow-none transition-all">
                <Save className="w-4 h-4 mr-2" /> Save Settings
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
