// Enhanced PostCard with professional design and better UX
import React from 'react';
import Link from "next/link";
import { formatDate, extractPreview, calculatePostStats } from "@/lib/utils";
import { Calendar, Tag, Clock, FileText, Edit, Eye, EyeOff } from "lucide-react";
import { Card, Button } from "@/components/ui";
import type { PostWithCategories } from "@/types";

interface PostCardProps {
  post: PostWithCategories;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export function PostCard({ post, showActions = false, variant = 'default', className }: PostCardProps) {
  const stats = calculatePostStats(post.content || '');
  
  const cardVariants = {
    default: 'hover:shadow-lg transition-all duration-200',
    compact: 'hover:shadow-md transition-shadow duration-200',
    featured: 'border-2 border-blue-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300'
  };

  return (
    <Card className={`${cardVariants[variant]} ${className || ''}`}>
      <article>
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.createdAt.toISOString()}>
                {formatDate(post.createdAt)}
              </time>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{stats.readingTime} min read</span>
            </div>
            
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{stats.wordCount} words</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!post.published && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                Draft
              </span>
            )}
            
            {variant === 'featured' && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                Featured
              </span>
            )}
          </div>
        </div>
        
        {/* Post Title */}
        <h2 className={`font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors ${
          variant === 'compact' ? 'text-lg' : 'text-xl'
        }`}>
          <Link href={`/posts/${post.slug}`} className="block">
            {post.title}
          </Link>
        </h2>
        
        {/* Post Preview */}
        {variant !== 'compact' && (
          <div 
            className="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: extractPreview(post.content || '', variant === 'featured' ? 400 : 300)
            }}
          />
        )}
        
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <Tag className="w-4 h-4 text-gray-400" />
            {post.categories.slice(0, 3).map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-md text-xs transition-colors"
              >
                {category.name}
              </Link>
            ))}
            {post.categories.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{post.categories.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                asChild
              >
                <Link 
                  href={`/posts/${post.slug}`}
                  className="flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Link>
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                asChild
              >
                <Link 
                  href={`/posts/${post.slug}/edit`}
                  className="flex items-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-500">
              {post.published ? (
                <div className="flex items-center gap-1 text-green-600">
                  <Eye className="w-4 h-4" />
                  <span>Published</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-yellow-600">
                  <EyeOff className="w-4 h-4" />
                  <span>Draft</span>
                </div>
              )}
            </div>
          </div>
        )}
      </article>
    </Card>
  );
}