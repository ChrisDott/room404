import { mutation, query } from "convex/_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    ownerId: v.id("users"),
    settings: v.object({
      visibility: v.union(
        v.literal("private"),
        v.literal("team"),
        v.literal("public")
      ),
      allowComments: v.boolean(),
      defaultPermissions: v.union(v.literal("read"), v.literal("write")),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
      ownerId: args.ownerId,
      settings: args.settings,
      createdAt: now,
      updatedAt: now,
    });
    return projectId;
  },
});

export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const listByOwner = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, { ownerId }) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .order("desc")
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    settings: v.optional(
      v.object({
        visibility: v.union(
          v.literal("private"),
          v.literal("team"),
          v.literal("public")
        ),
        allowComments: v.boolean(),
        defaultPermissions: v.union(v.literal("read"), v.literal("write")),
      })
    ),
  },
  handler: async (ctx, { id, ...updates }) => {
    const existing = await ctx.db.get(id);
    if (!existing) return null;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
    return await ctx.db.get(id);
  },
});


