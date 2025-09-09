import { mutation, query } from "convex/_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    preferences: v.optional(
      v.object({
        theme: v.union(v.literal("light"), v.literal("dark")),
        editorSettings: v.object({
          fontSize: v.number(),
          wordWrap: v.boolean(),
          minimap: v.boolean(),
        }),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existing) return existing._id;

    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      avatar: args.avatar,
      preferences:
        args.preferences ??
        {
          theme: "light",
          editorSettings: { fontSize: 14, wordWrap: true, minimap: false },
        },
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});


