"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { insforge, type Project } from "@/lib/insforge";
import Image from "next/image";

const ALL_TAGS = ["All", "Flutter", "Next.js", "React", "AI", "PostgreSQL", "Supabase", "Firebase", "InsForge"];

export function Projects() {
  const [filter, setFilter] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await insforge.database
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
        
      if (!error && data) {
        setProjects(data);
      }
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    project => filter === "All" || project.tags?.includes(filter)
  );

  const openGallery = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const closeGallery = () => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  // Build the full list of images for the selected project (cover + gallery)
  const getProjectImages = (project: Project): string[] => {
    const imgs: string[] = [];
    if (project.cover_image) imgs.push(project.cover_image);
    if (project.images && project.images.length > 0) {
      project.images.forEach(img => {
        if (img && !imgs.includes(img)) imgs.push(img);
      });
    }
    return imgs;
  };

  const selectedImages = selectedProject ? getProjectImages(selectedProject) : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
  };

  return (
    <section id="projects" className="py-24 container mx-auto px-4 md:px-8">
      <SectionHeading 
        title="Featured Projects" 
        subtitle="A selection of my recent work and side projects."
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilter(tag)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-2 ${
              filter === tag
                ? "bg-primary text-primary-foreground border-black shadow-[4px_4px_0_0_#000]"
                : "bg-card text-card-foreground border-primary hover:bg-primary/20 shadow-none"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center my-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="h-full group"
              >
                <div className="flex flex-col h-full bg-card border-2 border-primary shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#000] transition-all">
                  <div 
                    className="relative h-48 overflow-hidden border-b-2 border-primary cursor-pointer"
                    onClick={() => openGallery(project)}
                  >
                    {project.cover_image && (
                      <div className="absolute inset-0 bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.cover_image} 
                          alt={project.title || "Project"} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Gallery indicator */}
                    {project.images && project.images.length > 0 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs font-bold flex items-center gap-1 border border-white/30">
                        <Images className="w-3 h-3" />
                        {project.images.length + (project.cover_image ? 1 : 0)}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
                    <p className="text-foreground/80 text-sm mb-4 flex-grow">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-background text-foreground border border-primary rounded-none">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 mt-auto">
                      {project.demo_url && (
                        <a href={project.demo_url} target="_blank" rel="noreferrer">
                          <Button variant="default" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-black rounded-none shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {project.demo_url.includes('play.google.com') ? 'Play Store' : 'View Demo'}
                          </Button>
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noreferrer">
                          <Button variant="outline" size="sm" className="bg-card text-card-foreground border-2 border-primary hover:bg-primary/20 rounded-none shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none">
                            <FaGithub className="w-4 h-4 mr-2" />
                            Code
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={closeGallery}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl bg-card border-2 border-primary shadow-[8px_8px_0_0_#000] my-8 flex flex-col md:max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b-2 border-primary bg-background sticky top-0 z-10">
                <h3 className="text-xl md:text-2xl font-bold text-foreground line-clamp-1">{selectedProject.title}</h3>
                <button
                  onClick={closeGallery}
                  className="bg-card hover:bg-primary/20 text-foreground p-2 border-2 border-primary shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none transition-all ml-4 flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content area */}
              <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
                {/* Left column: Image Gallery */}
                <div className="w-full md:w-1/2 p-4 md:p-6 border-b-2 md:border-b-0 md:border-r-2 border-primary bg-background">
                  {selectedImages.length > 0 ? (
                    <div className="flex flex-col h-full">
                      <div className="relative w-full aspect-video bg-card border-2 border-primary shadow-[4px_4px_0_0_#000] mb-4 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedImages[currentImageIndex]}
                          alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                          className="w-full h-full object-contain"
                        />
                        {/* Navigation Arrows */}
                        {selectedImages.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 border-2 border-primary transition-colors"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 border-2 border-primary transition-colors"
                            >
                              <ChevronRight className="w-6 h-6" />
                            </button>
                          </>
                        )}
                      </div>
                      
                      {/* Thumbnail Strip */}
                      {selectedImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {selectedImages.map((img, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`relative w-16 h-16 flex-shrink-0 border-2 transition-all ${
                                index === currentImageIndex
                                  ? "border-primary shadow-[2px_2px_0_0_#000] opacity-100"
                                  : "border-primary/50 opacity-50 hover:opacity-100"
                              }`}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-card border-2 border-primary shadow-[4px_4px_0_0_#000] text-muted-foreground">
                      No images available
                    </div>
                  )}
                </div>

                {/* Right column: Details and Content */}
                <div className="w-full md:w-1/2 p-4 md:p-6 bg-card flex flex-col">
                  <p className="text-lg text-foreground/80 font-medium mb-6">
                    {selectedProject.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-background text-foreground border-2 border-primary shadow-[2px_2px_0_0_#000] rounded-none">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b-2 border-primary/30">
                    {selectedProject.demo_url && (
                      <a href={selectedProject.demo_url} target="_blank" rel="noreferrer">
                        <Button variant="default" size="default" className="bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-black rounded-none shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {selectedProject.demo_url.includes('play.google.com') ? 'Play Store' : 'View Live Demo'}
                        </Button>
                      </a>
                    )}
                    {selectedProject.github_url && (
                      <a href={selectedProject.github_url} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="default" className="bg-background text-foreground border-2 border-primary hover:bg-primary/20 rounded-none shadow-[2px_2px_0_0_#000] active:translate-y-px active:shadow-none">
                          <FaGithub className="w-4 h-4 mr-2" />
                          Source Code
                        </Button>
                      </a>
                    )}
                  </div>

                  {selectedProject.content ? (
                    <div 
                      className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-a:font-bold prose-img:border-2 prose-img:border-primary prose-img:shadow-[4px_4px_0_0_#000]"
                      dangerouslySetInnerHTML={{ __html: selectedProject.content }}
                    />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-primary bg-background">
                      No detailed case study available for this project.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
