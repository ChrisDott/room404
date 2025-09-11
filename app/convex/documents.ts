import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    content: v.string(),
    path: v.string(),
    type: v.union(
      v.literal("markdown"),
      v.literal("converted"),
      v.literal("template")
    ),
    originalFormat: v.optional(
      v.union(v.literal("docx"), v.literal("pdf"), v.literal("sheets"))
    ),
    authorId: v.id("users"),
    tags: v.array(v.string()),
    metadata: v.object({
      wordCount: v.number(),
      lastEditor: v.id("users"),
      version: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("documents", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

export const get = query({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .order("desc")
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    name: v.optional(v.string()),
    content: v.optional(v.string()),
    path: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("markdown"),
        v.literal("converted"),
        v.literal("template")
      )
    ),
    tags: v.optional(v.array(v.string())),
    metadata: v.optional(
      v.object({
        wordCount: v.number(),
        lastEditor: v.id("users"),
        version: v.number(),
      })
    ),
  },
  handler: async (ctx, { id, ...updates }) => {
    const doc = await ctx.db.get(id);
    if (!doc) return null;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get(id);
    if (!doc) return null;
    await ctx.db.delete(id);
    return { success: true, deletedId: id };
  },
});

export const rename = mutation({
  args: { 
    id: v.id("documents"), 
    name: v.string() 
  },
  handler: async (ctx, { id, name }) => {
    const doc = await ctx.db.get(id);
    if (!doc) return null;
    await ctx.db.patch(id, { 
      name, 
      updatedAt: Date.now() 
    });
    return await ctx.db.get(id);
  },
});

export const search = query({
  args: { 
    projectId: v.optional(v.id("projects")),
    searchTerm: v.string() 
  },
  handler: async (ctx, { projectId, searchTerm }) => {
    let query = ctx.db.query("documents");
    
    if (projectId) {
      query = query.withIndex("by_project", (q) => q.eq("projectId", projectId));
    }
    
    const docs = await query.collect();
    
    // Simple text search in name and content
    return docs.filter(doc => 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },
});

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 10 }) => {
    return await ctx.db
      .query("documents")
      .withIndex("by_updatedAt", (q) => q)
      .order("desc")
      .take(limit);
  },
});



