import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Include Convex Auth tables
  ...authTables,

  users: defineTable({
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    preferences: v.optional(v.object({
      theme: v.union(v.literal("light"), v.literal("dark")),
      editorSettings: v.object({
        fontSize: v.number(),
        wordWrap: v.boolean(),
        minimap: v.boolean(),
      }),
    })),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("by_createdAt", ["createdAt"]),

  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    ownerId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
    settings: v.object({
      visibility: v.union(
        v.literal("private"),
        v.literal("team"),
        v.literal("public")
      ),
      allowComments: v.boolean(),
      defaultPermissions: v.union(
        v.literal("read"),
        v.literal("write")
      ),
    }),
  })
    .index("by_owner", ["ownerId"]) 
    .index("by_createdAt", ["createdAt"]),

  documents: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
    tags: v.array(v.string()),
    metadata: v.object({
      wordCount: v.number(),
      lastEditor: v.id("users"),
      version: v.number(),
    }),
  })
    .index("by_project", ["projectId"]) 
    .index("by_path", ["projectId", "path"]) 
    .index("by_updatedAt", ["updatedAt"]),

  projectMembers: defineTable({
    projectId: v.id("projects"),
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("editor"),
      v.literal("viewer")
    ),
    createdAt: v.number(),
  })
    .index("by_project", ["projectId"]) 
    .index("by_user", ["userId"]) 
    .index("by_project_user", ["projectId", "userId"]),
});



