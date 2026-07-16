import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Star, 
  AlertCircle,
  X,
  Inbox
} from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import type { Question, Platform, Difficulty } from '../types';
import { QuestionCard } from '../components/QuestionCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { getTodayDateString } from '../utils/dateUtils';

export const AllQuestions: React.FC = () => {
  const { questions, addQuestion, updateQuestion } = useDatabase();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [showFavouriteOnly, setShowFavouriteOnly] = useState(false);
  const [showNeedsPracticeOnly, setShowNeedsPracticeOnly] = useState(false);
  const [revisionFilter, setRevisionFilter] = useState<'All' | 'Pending' | 'Completed'>('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formPlatform, setFormPlatform] = useState<Platform>('LeetCode');
  const [formTopic, setFormTopic] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>('Easy');
  const [formLink, setFormLink] = useState('');
  const [formSolvedDate, setFormSolvedDate] = useState(getTodayDateString());
  const [formNotes, setFormNotes] = useState('');
  const [formIsFavourite, setFormIsFavourite] = useState(false);
  const [formNeedsPractice, setFormNeedsPractice] = useState(false);

  // Extract unique topics for the filter dropdown
  const uniqueTopics = useMemo(() => {
    const topics = new Set<string>();
    questions.forEach(q => {
      if (q.topic) topics.add(q.topic.trim());
    });
    return ['All', ...Array.from(topics).sort()];
  }, [questions]);

  // Handle opening of Add Modal
  const openAddModal = () => {
    setFormName('');
    setFormPlatform('LeetCode');
    setFormTopic('');
    setFormDifficulty('Easy');
    setFormLink('');
    setFormSolvedDate(getTodayDateString());
    setFormNotes('');
    setFormIsFavourite(false);
    setFormNeedsPractice(false);
    setIsAddModalOpen(true);
  };

  // Handle opening of Edit Modal
  const openEditModal = (q: Question) => {
    setEditingQuestion(q);
    setFormName(q.name);
    setFormPlatform(q.platform);
    setFormTopic(q.topic);
    setFormDifficulty(q.difficulty);
    setFormLink(q.link);
    setFormSolvedDate(q.solvedDate);
    setFormNotes(q.notes);
    setFormIsFavourite(q.isFavourite);
    setFormNeedsPractice(q.needsPractice);
  };

  // Form submit handlers
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formLink) return;

    addQuestion({
      name: formName,
      platform: formPlatform,
      topic: formTopic || 'General',
      difficulty: formDifficulty,
      link: formLink,
      solvedDate: formSolvedDate,
      notes: formNotes,
      isFavourite: formIsFavourite,
      needsPractice: formNeedsPractice,
    });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !formName || !formLink) return;

    updateQuestion(editingQuestion.id, {
      name: formName,
      platform: formPlatform,
      topic: formTopic || 'General',
      difficulty: formDifficulty,
      link: formLink,
      solvedDate: formSolvedDate,
      notes: formNotes,
      isFavourite: formIsFavourite,
      needsPractice: formNeedsPractice,
    });
    setEditingQuestion(null);
  };

  // Filter questions dynamically
  const filteredQuestions = useMemo(() => {
    
    return questions.filter(q => {
      // 1. Search Query (name match)
      const matchesSearch = q.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Topic filter
      const matchesTopic = selectedTopic === 'All' || q.topic === selectedTopic;
      
      // 3. Difficulty filter
      const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
      
      // 4. Platform filter
      const matchesPlatform = selectedPlatform === 'All' || q.platform === selectedPlatform;
      
      // 5. Star filter
      const matchesFavourite = !showFavouriteOnly || q.isFavourite;
      
      // 6. Practice filter
      const matchesNeedsPractice = !showNeedsPracticeOnly || q.needsPractice;

      // 7. Revision Status filter
      let matchesRevision = true;
      const nextPending = q.revisions.find(r => r.status === 'pending' || r.status === 'overdue');
      
      if (revisionFilter === 'Pending') {
        matchesRevision = !!nextPending;
      } else if (revisionFilter === 'Completed') {
        matchesRevision = !nextPending;
      }

      return matchesSearch && matchesTopic && matchesDifficulty && matchesPlatform && matchesFavourite && matchesNeedsPractice && matchesRevision;
    });
  }, [
    questions,
    searchQuery,
    selectedTopic,
    selectedDifficulty,
    selectedPlatform,
    showFavouriteOnly,
    showNeedsPracticeOnly,
    revisionFilter
  ]);

  // Helper to reset all search/filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedTopic('All');
    setSelectedDifficulty('All');
    setSelectedPlatform('All');
    setShowFavouriteOnly(false);
    setShowNeedsPracticeOnly(false);
    setRevisionFilter('All');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">All Solved Questions</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Search, filter, and organize your DSA problem sets.
          </p>
        </div>
        <Button variant="primary" onClick={openAddModal} className="shrink-0 active:scale-[0.98]">
          <Plus size={16} />
          Add Question
        </Button>
      </div>

      {/* Filter Options Toolbar */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-4 shadow-xs space-y-4">
        {/* Search and Checkboxes */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 dark:text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Search by problem name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-250 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Favourite Filter Toggle */}
            <button
              onClick={() => setShowFavouriteOnly(!showFavouriteOnly)}
              className={`h-9 px-3.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showFavouriteOnly 
                  ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40' 
                  : 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Star size={13} fill={showFavouriteOnly ? 'currentColor' : 'none'} />
              Favourites
            </button>

            {/* Need Practice Filter Toggle */}
            <button
              onClick={() => setShowNeedsPracticeOnly(!showNeedsPracticeOnly)}
              className={`h-9 px-3.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showNeedsPracticeOnly 
                  ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40' 
                  : 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <AlertCircle size={13} />
              Needs Practice
            </button>
          </div>
        </div>

        {/* Dropdown Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Topic Select */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pl-1">Topic</span>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="h-9 px-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-250 dark:border-zinc-800 rounded-lg text-xs text-zinc-800 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {uniqueTopics.map((topic, i) => (
                <option key={i} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Select */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pl-1">Difficulty</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="h-9 px-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-250 dark:border-zinc-800 rounded-lg text-xs text-zinc-800 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Platform Select */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pl-1">Platform</span>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="h-9 px-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-250 dark:border-zinc-800 rounded-lg text-xs text-zinc-800 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Platforms</option>
              <option value="LeetCode">LeetCode</option>
              <option value="Striver">Striver Sheet</option>
              <option value="GFG">GeeksForGeeks</option>
              <option value="CodeStudio">CodeStudio</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Revision Filter Select */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pl-1">Revision Status</span>
            <select
              value={revisionFilter}
              onChange={(e) => setRevisionFilter(e.target.value as any)}
              className="h-9 px-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-250 dark:border-zinc-800 rounded-lg text-xs text-zinc-800 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Revisions</option>
              <option value="Pending">Revision Pending</option>
              <option value="Completed">Completed All</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Indicator */}
        {(searchQuery || selectedTopic !== 'All' || selectedDifficulty !== 'All' || selectedPlatform !== 'All' || showFavouriteOnly || showNeedsPracticeOnly || revisionFilter !== 'All') && (
          <div className="flex items-center justify-between border-t border-zinc-150 dark:border-zinc-800 pt-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span>Showing <span className="font-semibold">{filteredQuestions.length}</span> matching question{filteredQuestions.length !== 1 ? 's' : ''}</span>
            <button 
              onClick={handleClearFilters}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <X size={12} />
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Questions Cards List Grid */}
      {filteredQuestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuestions.map((q) => (
            <QuestionCard 
              key={q.id} 
              question={q} 
              onEdit={openEditModal} 
            />
          ))}
        </div>
      ) : (
        /* Empty Filters state */
        <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-xl max-w-xl mx-auto space-y-3">
          <Inbox size={32} className="text-zinc-350 dark:text-zinc-700" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-200">No Questions Match Filters</h3>
          <p className="text-xs text-zinc-450 dark:text-zinc-400 max-w-sm">
            Try adjusting your search query, difficulty tags, or topic filters to locate your solved items.
          </p>
          <Button variant="secondary" size="sm" onClick={handleClearFilters} className="mt-1">
            Clear Filters
          </Button>
        </div>
      )}

      {/* Add / Edit Modals */}
      <Modal
        isOpen={isAddModalOpen || !!editingQuestion}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingQuestion(null);
        }}
        title={editingQuestion ? 'Edit Solved Question' : 'Add Solved Question'}
      >
        <form onSubmit={editingQuestion ? handleEditSubmit : handleAddSubmit} className="space-y-4">
          {/* Problem Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-400">Problem Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. 3Sum"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="h-9 px-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Platform Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-400">Platform *</label>
              <select
                value={formPlatform}
                onChange={(e) => setFormPlatform(e.target.value as Platform)}
                className="h-9 px-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="LeetCode">LeetCode</option>
                <option value="Striver">Striver Sheet</option>
                <option value="GFG">GeeksForGeeks</option>
                <option value="CodeStudio">CodeStudio</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Difficulty Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-400">Difficulty *</label>
              <select
                value={formDifficulty}
                onChange={(e) => setFormDifficulty(e.target.value as Difficulty)}
                className="h-9 px-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Topic Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-400">Topic *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dynamic Programming"
                value={formTopic}
                onChange={(e) => setFormTopic(e.target.value)}
                className="h-9 px-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                list="topic-suggestions"
              />
              <datalist id="topic-suggestions">
                <option value="Arrays & Hashing" />
                <option value="Two Pointers" />
                <option value="Sliding Window" />
                <option value="Stack" />
                <option value="Binary Search" />
                <option value="Linked List" />
                <option value="Trees" />
                <option value="Tries" />
                <option value="Heap / Priority Queue" />
                <option value="Backtracking" />
                <option value="Graphs" />
                <option value="Advanced Graphs" />
                <option value="Dynamic Programming" />
                <option value="Greedy" />
                <option value="Bit Manipulation" />
                <option value="Math & Geometry" />
              </datalist>
            </div>

            {/* Solved Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-400">Date Solved *</label>
              <input
                type="date"
                required
                value={formSolvedDate}
                onChange={(e) => setFormSolvedDate(e.target.value)}
                className="h-9 px-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Problem Link */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-400">Problem URL Link *</label>
            <input
              type="url"
              required
              placeholder="e.g. https://leetcode.com/problems/..."
              value={formLink}
              onChange={(e) => setFormLink(e.target.value)}
              className="h-9 px-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-650 dark:text-zinc-400">Personal Notes & Hints</label>
            <textarea
              placeholder="Add key insights, time/space complexities, pseudo codes..."
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              rows={4}
              className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-855 rounded-lg text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-5 pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-350">
              <input
                type="checkbox"
                checked={formIsFavourite}
                onChange={(e) => setFormIsFavourite(e.target.checked)}
                className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 h-4 w-4 bg-zinc-50 dark:bg-zinc-950 cursor-pointer"
              />
              Mark as Favourite
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-350">
              <input
                type="checkbox"
                checked={formNeedsPractice}
                onChange={(e) => setFormNeedsPractice(e.target.checked)}
                className="rounded border-zinc-300 dark:border-zinc-700 text-blue-600 focus:ring-blue-500 h-4 w-4 bg-zinc-50 dark:bg-zinc-950 cursor-pointer"
              />
              Needs More Practice
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-150 dark:border-zinc-850">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingQuestion(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="active:scale-[0.98]">
              {editingQuestion ? 'Save Changes' : 'Add Question'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default AllQuestions;
