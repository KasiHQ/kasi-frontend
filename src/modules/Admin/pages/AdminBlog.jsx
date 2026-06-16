import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Globe, Eye, Upload, X, Loader2, ArrowLeft, RefreshCw, CheckCircle, AlertTriangle, User, Bold, Italic, Link2, List, Code, Quote, AlertCircle, Image } from 'lucide-react';
import api from '../../../api/axios';

const CATEGORIES = [
  'Announcements',
  'Product Updates',
  'How It Works',
  'Vendor Stories',
  'AI & Commerce',
  'For Founders'
];

const CATEGORY_GUIDES = {
  'Announcements': 'Product launches, funding news, major milestones, new features',
  'Product Updates': 'Changelog-style posts, new integrations, improvements, fixes',
  'How It Works': 'Tutorials, walkthroughs, vendor guides, onboarding tips',
  'Vendor Stories': 'Real vendor success stories, case studies, testimonials',
  'AI & Commerce': 'Thought leadership on AI, social commerce, African market trends',
  'For Founders': 'Startup journey posts, behind the scenes, building in public'
};

// Simple, clean Markdown to HTML parser
const parseMarkdown = (markdown) => {
  if (!markdown) return '';
  
  let html = markdown
    // Escape HTML tags to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Restore > for blockquotes specifically
    .replace(/^&gt;\s+(.*)$/gim, '<blockquote>$1</blockquote>')
    // Headings
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4 border-b pb-1">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-gray-900 dark:text-white mt-10 mb-5">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Inline code
    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-emerald-600 dark:text-emerald-400">$1</code>')
    // Images
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded-xl my-6 mx-auto max-h-[400px] object-cover shadow-md" />')
    // Links
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-semibold underline">$1</a>')
    // Lists
    .replace(/^\s*[-*+]\s+(.*)$/gim, '<li class="ml-6 list-disc text-gray-600 dark:text-gray-300 my-1">$1</li>');

  // Handle blockquote groupings and paragraphs
  const lines = html.split('\n');
  let result = [];
  let inList = false;
  let inQuote = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (line.startsWith('<li')) {
      if (!inList) {
        result.push('<ul class="my-4">');
        inList = true;
      }
      result.push(lines[i]);
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }

      if (line.startsWith('<blockquote>')) {
        // Parse custom blockquote notes like [!NOTE] or [!TIP]
        let quoteContent = line.replace('<blockquote>', '').replace('</blockquote>', '');
        
        let alertClass = "border-l-4 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 my-6 rounded-r-xl";
        let alertLabel = "NOTE";
        
        if (quoteContent.startsWith('[!NOTE]')) {
          quoteContent = quoteContent.replace('[!NOTE]', '').trim();
          alertClass = "border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 p-4 my-6 rounded-r-xl";
          alertLabel = "💡 NOTE";
        } else if (quoteContent.startsWith('[!TIP]')) {
          quoteContent = quoteContent.replace('[!TIP]', '').trim();
          alertClass = "border-l-4 border-green-500 bg-green-50/50 dark:bg-green-950/20 p-4 my-6 rounded-r-xl";
          alertLabel = "⚡ TIP";
        } else if (quoteContent.startsWith('[!WARNING]')) {
          quoteContent = quoteContent.replace('[!WARNING]', '').trim();
          alertClass = "border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 p-4 my-6 rounded-r-xl";
          alertLabel = "⚠️ WARNING";
        } else if (quoteContent.startsWith('[!IMPORTANT]')) {
          quoteContent = quoteContent.replace('[!IMPORTANT]', '').trim();
          alertClass = "border-l-4 border-red-500 bg-red-50/50 dark:bg-red-950/20 p-4 my-6 rounded-r-xl";
          alertLabel = "🔥 IMPORTANT";
        }

        result.push(`<div class="${alertClass}"><span class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">${alertLabel}</span><p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">${quoteContent}</p></div>`);
      } else if (line !== '' && !line.startsWith('<h') && !line.startsWith('<div')) {
        result.push(`<p class="text-gray-700 dark:text-gray-300 leading-relaxed my-4 text-base">${lines[i]}</p>`);
      } else {
        result.push(lines[i]);
      }
    }
  }

  if (inList) result.push('</ul>');

  return result.join('\n');
};

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Editor/Create states
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'
  const [currentPost, setCurrentPost] = useState(null); // null means creating a new post
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    featured_image: '',
    category: 'Announcements',
    read_time: 5,
    author_name: 'Kasi Team',
    author_role: 'Contributor',
    author_image: '',
    status: 'draft'
  });
  
  const [imageUploading, setImageUploading] = useState({ featured: false, author: false });
  const [submitLoading, setSubmitLoading] = useState(false);
  
  const textareaRef = React.useRef(null);
  const [inlineUploading, setInlineUploading] = useState(false);

  const insertAtCursor = (beforeText, afterText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    const selectedText = text.substring(start, end);
    const replacement = beforeText + selectedText + afterText;
    
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setFormData(prev => ({ ...prev, content: newContent }));
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + beforeText.length, start + beforeText.length + selectedText.length);
    }, 0);
  };

  const handleInlineImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const uploadData = new FormData();
    uploadData.append('file', file);
    
    try {
      setInlineUploading(true);
      const res = await api.post('/api/blog/admin/upload-image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      insertAtCursor(`\n![${file.name.split('.')[0]}](${res.data.url})\n`);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to upload image. Make sure image is under 5MB.');
    } finally {
      setInlineUploading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      insertAtCursor('**', '**');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      insertAtCursor('*', '*');
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/api/blog/admin/posts');
      setPosts(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load blog posts. Check if migration is complete.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleTitleChange = (e) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .replace(/\s+/g, '-'); // replace spaces with dashes
      
    setFormData({
      ...formData,
      title,
      slug: currentPost ? formData.slug : generatedSlug // only auto-generate slug for new posts
    });
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const uploadData = new FormData();
    uploadData.append('file', file);
    
    try {
      setImageUploading(prev => ({ ...prev, [type]: true }));
      const res = await api.post('/api/blog/admin/upload-image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (type === 'featured') {
        setFormData(prev => ({ ...prev, featured_image: res.data.url }));
      } else {
        setFormData(prev => ({ ...prev, author_image: res.data.url }));
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to upload image. Make sure image is under 5MB.');
    } finally {
      setImageUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const startCreate = () => {
    setCurrentPost(null);
    setFormData({
      title: '',
      slug: '',
      summary: '',
      content: '',
      featured_image: '',
      category: 'Announcements',
      read_time: 5,
      author_name: 'Han Wang', // default matches design screenshot example
      author_role: 'Co-Founder',
      author_image: '',
      status: 'draft'
    });
    setIsEditing(true);
    setActiveTab('write');
  };

  const startEdit = (post) => {
    setCurrentPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      summary: post.summary || '',
      content: post.content,
      featured_image: post.featured_image || '',
      category: post.category,
      read_time: post.read_time,
      author_name: post.author_name,
      author_role: post.author_role,
      author_image: post.author_image || '',
      status: post.status
    });
    setIsEditing(true);
    setActiveTab('write');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.content) {
      alert('Title, Slug and Content are required!');
      return;
    }

    try {
      setSubmitLoading(true);
      setError('');
      if (currentPost) {
        // Update
        await api.put(`/api/blog/admin/posts/${currentPost.id}`, formData);
      } else {
        // Create
        await api.post('/api/blog/admin/posts', formData);
      }
      setIsEditing(false);
      fetchPosts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save blog post.');
      window.scrollTo(0, 0);
    } finally {
      setSubmitLoading(false);
    }
  };

  const deletePost = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.delete(`/api/blog/admin/posts/${id}`);
      fetchPosts();
    } catch (err) {
      alert('Failed to delete blog post.');
    }
  };

  const togglePublish = async (post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    const action = newStatus === 'published' ? 'publish' : 'unpublish';
    if (!confirm(`Are you sure you want to ${action} this post?`)) return;
    
    try {
      await api.put(`/api/blog/admin/posts/${post.id}`, { status: newStatus });
      fetchPosts();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Editor Header */}
        <div className="flex justify-between items-center border-b pb-4 border-gray-150 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentPost ? 'Edit Blog Post' : 'Write New Blog Post'}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentPost ? `Editing: ${currentPost.title}` : 'Draft your thought leadership article'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
              type="button"
              className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${
                formData.status === 'draft'
                  ? 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800'
              }`}
            >
              Save as Draft
            </button>
            <button
              onClick={() => setFormData(prev => ({ ...prev, status: 'published' }))}
              type="button"
              className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all flex items-center gap-1.5 ${
                formData.status === 'published'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800'
              }`}
            >
              <Globe size={15} /> Publish Live
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 rounded-2xl flex items-start gap-2 border border-red-100 dark:border-red-900/20">
            <AlertTriangle className="shrink-0 mt-0.5" size={18} />
            <div>
              <span className="font-bold">Error saving article:</span> {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-950 dark:text-white font-semibold text-lg"
                  placeholder="e.g. Mintlify raises $45M Series B..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Slug (URL Path)</label>
                  <input
                    required
                    type="text"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-950 dark:text-white font-mono text-sm"
                    placeholder="e.g. mintlify-raises-45m-series-b"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-950 dark:text-white"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium italic">
                    {CATEGORY_GUIDES[formData.category] || ''}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Summary Snippet</label>
                <textarea
                  value={formData.summary}
                  onChange={e => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-950 dark:text-white text-sm"
                  rows={2}
                  placeholder="A short summaries paragraph displayed on the card. Keep it descriptive..."
                />
              </div>
            </div>

            {/* Markdown Content Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden flex flex-col">
              {/* Tab Header */}
              <div className="flex border-b border-gray-150 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
                    activeTab === 'write'
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  Write Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeTab === 'preview'
                      ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                      : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Eye size={15} /> Real-time Preview
                </button>
              </div>

              {/* Editor Content Area */}
              <div className="p-4 min-h-[400px]">
                {activeTab === 'write' ? (
                  <div className="space-y-2">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 bg-gray-50 dark:bg-gray-900">
                      {/* Editor Toolbar */}
                      <div className="flex flex-wrap items-center gap-1 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <button
                          type="button"
                          onClick={() => insertAtCursor('**', '**')}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 transition-colors"
                          title="Bold (Ctrl+B)"
                        >
                          <Bold size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertAtCursor('*', '*')}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 transition-colors"
                          title="Italic (Ctrl+I)"
                        >
                          <Italic size={16} />
                        </button>
                        <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertAtCursor('## ')}
                          className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors"
                          title="Heading 2"
                        >
                          H2
                        </button>
                        <button
                          type="button"
                          onClick={() => insertAtCursor('### ')}
                          className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors"
                          title="Heading 3"
                        >
                          H3
                        </button>
                        <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertAtCursor('- ')}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 transition-colors"
                          title="Bullet List"
                        >
                          <List size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertAtCursor('> ')}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 transition-colors"
                          title="Blockquote"
                        >
                          <Quote size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertAtCursor('`', '`')}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 transition-colors"
                          title="Inline Code"
                        >
                          <Code size={16} />
                        </button>
                        <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
                        <button
                          type="button"
                          onClick={() => insertAtCursor('[', '](https://)')}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 transition-colors"
                          title="Insert Link"
                        >
                          <Link2 size={16} />
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => insertAtCursor('> [!NOTE]\n> ')}
                          className="px-2 py-1 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-colors flex items-center gap-1"
                          title="Insert Note Card"
                        >
                          <AlertCircle size={13} /> Alert
                        </button>

                        <div className="w-[1px] h-4 bg-gray-200 dark:bg-gray-700 mx-1" />

                        {/* Inline Image Uploader */}
                        <label className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold" title="Insert Image between articles">
                          {inlineUploading ? (
                            <Loader2 size={14} className="animate-spin text-emerald-500" />
                          ) : (
                            <Image size={14} className="text-emerald-500" />
                          )}
                          <span className="text-emerald-650 dark:text-emerald-400 font-bold">Insert Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleInlineImageUpload}
                            className="hidden"
                            disabled={inlineUploading}
                          />
                        </label>
                      </div>

                      <textarea
                        ref={textareaRef}
                        required
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                        onKeyDown={handleKeyDown}
                        className="w-full p-4 border-0 bg-transparent outline-none font-mono text-sm text-gray-950 dark:text-white min-h-[400px] block focus:ring-0"
                        placeholder={`Write your article here...
Use the toolbar above to format and upload images directly inside the content.

Supported:
## Subheading
Write text here. Use **bold** or *italics*.
You can embed inline \`code\` blocks.

> [!NOTE]
> This is a beautiful green alert card in Mintlify layout.
You can also use [!TIP], [!WARNING], or [!IMPORTANT] inside blockquotes.`}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Pro-tip: Use the <strong>Insert Image</strong> button in the toolbar to upload images directly between your paragraphs.
                    </p>
                  </div>
                ) : (
                  <div 
                    className="prose dark:prose-invert max-w-none p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl min-h-[400px]"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(formData.content) }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Settings / Uploads Side Panel (1 Column) */}
          <div className="space-y-6">
            {/* Featured Cover Image */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                Cover Photo
              </h3>
              
              {formData.featured_image ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                  <img src={formData.featured_image} alt="Featured cover" className="w-full h-40 object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, featured_image: '' })}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-emerald-500 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50 dark:bg-gray-900">
                  {imageUploading.featured ? (
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                  ) : (
                    <>
                      <Upload size={24} className="text-gray-400 mb-1" />
                      <span className="text-xs font-bold text-gray-500">Upload Cover Photo</span>
                      <span className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, 'featured')}
                    className="hidden"
                    disabled={imageUploading.featured}
                  />
                </label>
              )}
              
              <div>
                <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Direct Image URL (Optional)</label>
                <input
                  type="text"
                  value={formData.featured_image}
                  onChange={e => setFormData({ ...formData, featured_image: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-xs text-gray-900 dark:text-white"
                  placeholder="https://cloudinary.com/..."
                />
              </div>
            </div>

            {/* Author Settings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Author Profile</h3>
              
              <div className="flex items-center gap-3">
                {formData.author_image ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200 group shrink-0">
                    <img src={formData.author_image} alt="Author avatar" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, author_image: '' })}
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50 dark:bg-gray-900 shrink-0">
                    {imageUploading.author ? (
                      <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                    ) : (
                      <User size={18} className="text-gray-400" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageUpload(e, 'author')}
                      className="hidden"
                      disabled={imageUploading.author}
                    />
                  </label>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Author Avatar</p>
                  <p className="text-[10px] text-gray-400">Square PNG/JPG</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Author Name</label>
                <input
                  required
                  type="text"
                  value={formData.author_name}
                  onChange={e => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white"
                  placeholder="e.g. Han Wang"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Author Role</label>
                <input
                  required
                  type="text"
                  value={formData.author_role}
                  onChange={e => setFormData({ ...formData, author_role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white"
                  placeholder="e.g. Co-Founder"
                />
              </div>
            </div>

            {/* Publishing Settings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Settings</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Read Time (minutes)</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={formData.read_time}
                  onChange={e => setFormData({ ...formData, read_time: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white"
                />
              </div>
              
              <button
                disabled={submitLoading}
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md shadow-emerald-100 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle size={18} />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-150 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="text-emerald-500" /> Blog Post Manager
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Write, edit, and organize articles hosted on blog.usekasi.com</p>
        </div>
        <button 
          onClick={startCreate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-md shadow-emerald-100 dark:shadow-none transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Write Article
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 rounded-2xl flex items-start gap-2 border border-red-100 dark:border-red-900/20">
          <AlertTriangle className="shrink-0 mt-0.5" size={18} />
          <div>
            <span className="font-bold">Error:</span> {error}
            <button onClick={fetchPosts} className="ml-3 text-emerald-600 hover:underline inline-flex items-center gap-0.5 font-bold">
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/40 border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  <th className="p-4">Cover & Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3.5 min-w-[300px]">
                        <div className="w-16 h-10 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700 overflow-hidden shrink-0">
                          {post.featured_image ? (
                            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <FileText size={16} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white truncate" title={post.title}>{post.title}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate font-mono">/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {post.author_image ? (
                          <img src={post.author_image} alt={post.author_name} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 shrink-0">
                            <User size={12} />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-xs text-gray-900 dark:text-white">{post.author_name}</p>
                          <p className="text-[10px] text-gray-400">{post.author_role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <button 
                        onClick={() => togglePublish(post)}
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase border transition-all ${
                          post.status === 'published'
                            ? 'bg-green-50 text-green-700 border-green-150 hover:bg-green-100'
                            : 'bg-amber-50 text-amber-700 border-amber-150 hover:bg-amber-100 dark:bg-amber-950/10 dark:text-amber-500 dark:border-amber-900/30'
                        }`}
                      >
                        {post.status === 'published' ? 'Live' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(post)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-emerald-600 dark:text-gray-400 rounded-lg transition-colors"
                          title="Edit Post"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-red-600 dark:text-gray-400 rounded-lg transition-colors"
                          title="Delete Post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-400 dark:text-gray-500">
                      No blog posts written yet. Click "Write Article" to start posting.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
