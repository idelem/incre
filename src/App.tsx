import React, { useState, useMemo } from 'react';
import { Calendar, MessageSquare, Quote, Clock, Search, Plus, ChevronDown, ChevronRight, ArrowUpRight } from 'lucide-react';

// 模拟数据 - 创建完整的引用链条
const initialNotes = [
  {
    id: 1,
    content: "今天读了一本关于时间管理的书，发现番茄工作法真的很有效。25分钟专注工作，5分钟休息，这个节奏很棒。",
    timestamp: new Date('2024-12-20T10:30:00'),
    author: "我",
    originalId: null,
    quotedNote: null,
    tags: ["读书", "时间管理"]
  },
  {
    id: 2,
    content: "深有同感！我用番茄工作法已经一年了，效率提升明显。特别是对于编程工作，能帮助保持专注。",
    timestamp: new Date('2024-12-20T14:20:00'),
    author: "我",
    originalId: null,
    quotedNote: {
      id: 1,
      content: "今天读了一本关于时间管理的书，发现番茄工作法真的很有效。25分钟专注工作，5分钟休息，这个节奏很棒。",
      author: "我",
      timestamp: new Date('2024-12-20T10:30:00')
    },
    tags: ["工作方法", "编程"]
  },
  {
    id: 3,
    content: "不过我发现25分钟对我来说有点短，我调整成了45分钟一个周期，效果更好。",
    timestamp: new Date('2024-12-20T16:15:00'),
    author: "我",
    originalId: null,
    quotedNote: {
      id: 2,
      content: "深有同感！我用番茄工作法已经一年了，效率提升明显。特别是对于编程工作，能帮助保持专注。",
      author: "我",
      timestamp: new Date('2024-12-20T14:20:00')
    },
    tags: ["工作方法", "个人定制"]
  },
  {
    id: 4,
    content: "有道理！每个人的专注力持续时间不同，重要的是找到适合自己的节奏。我也试试45分钟的版本。",
    timestamp: new Date('2024-12-20T18:30:00'),
    author: "我",
    originalId: null,
    quotedNote: {
      id: 3,
      content: "不过我发现25分钟对我来说有点短，我调整成了45分钟一个周期，效果更好。",
      author: "我",
      timestamp: new Date('2024-12-20T16:15:00')
    },
    tags: ["工作方法", "实验"]
  },
  {
    id: 5,
    content: "刚刚看完《原子习惯》，里面提到的1%改进理论很有启发。每天进步一点点，一年后就是37倍的提升。",
    timestamp: new Date('2024-12-21T09:15:00'),
    author: "我",
    originalId: null,
    quotedNote: null,
    tags: ["读书", "习惯"]
  },
  {
    id: 6,
    content: "这个理论很棒！结合番茄工作法，每个番茄时间都是一个小的改进机会。",
    timestamp: new Date('2024-12-21T16:45:00'),
    author: "我",
    originalId: null,
    quotedNote: {
      id: 5,
      content: "刚刚看完《原子习惯》，里面提到的1%改进理论很有启发。每天进步一点点，一年后就是37倍的提升。",
      author: "我",
      timestamp: new Date('2024-12-21T09:15:00')
    },
    tags: ["习惯", "工作方法"]
  },
  {
    id: 7,
    content: "今天尝试了新的阅读方法 - 主动阅读。边读边思考，边做笔记，理解深度明显提升。",
    timestamp: new Date('2024-12-22T11:00:00'),
    author: "我",
    originalId: null,
    quotedNote: null,
    tags: ["阅读", "学习方法"]
  },
  // 创建另一条引用链
  {
    id: 8,
    content: "我也试了45分钟的番茄工作法，但发现中间需要一个5分钟的小休息提醒，不然容易疲劳。",
    timestamp: new Date('2024-12-21T10:30:00'),
    author: "我",
    originalId: null,
    quotedNote: {
      id: 4,
      content: "有道理！每个人的专注力持续时间不同，重要的是找到适合自己的节奏。我也试试45分钟的版本。",
      author: "我",
      timestamp: new Date('2024-12-20T18:30:00')
    },
    tags: ["工作方法", "优化"]
  }
];

const FlomoApp = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('timeline'); // timeline, calendar, detail
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [quotingNote, setQuotingNote] = useState(null);

  // 获取指定日期的笔记
  const getNotesForDate = (date) => {
    return notes.filter(note => {
      const noteDate = new Date(note.timestamp);
      return noteDate.toDateString() === date.toDateString();
    });
  };

  // 搜索笔记
  const filteredNotes = useMemo(() => {
    if (!searchTerm) return notes;
    return notes.filter(note => 
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [notes, searchTerm]);

  // 创建新笔记
  const createNote = () => {
    if (!newNote.trim()) return;
    
    const note = {
      id: Date.now(),
      content: newNote,
      timestamp: new Date(),
      author: "我",
      originalId: null,
      quotedNote: quotingNote,
      tags: extractTags(newNote)
    };
    
    setNotes([note, ...notes]);
    setNewNote('');
    setQuotingNote(null);
  };

  // 提取标签
  const extractTags = (content) => {
    const tagRegex = /#([^\s#]+)/g;
    const matches = content.match(tagRegex);
    return matches ? matches.map(tag => tag.slice(1)) : [];
  };

  // 转发笔记
  const quoteNote = (note) => {
    setQuotingNote({
      id: note.id,
      content: note.content,
      author: note.author,
      timestamp: note.timestamp
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 获取笔记的完整引用链条
  const getNoteReferences = (noteId) => {
    const references = {
      ancestors: [], // 上级引用链（这条笔记引用的所有上级）
      descendants: [] // 下级引用链（所有引用这条笔记的下级）
    };
    
    // 获取上级引用链
    const getAncestors = (currentNoteId, visited = new Set()) => {
      if (visited.has(currentNoteId)) return []; // 防止循环引用
      visited.add(currentNoteId);
      
      const currentNote = notes.find(n => n.id === currentNoteId);
      if (!currentNote || !currentNote.quotedNote) return [];
      
      const parent = currentNote.quotedNote;
      const parentFullNote = notes.find(n => n.id === parent.id) || parent;
      
      return [parentFullNote, ...getAncestors(parent.id, visited)];
    };
    
    // 获取下级引用链
    const getDescendants = (currentNoteId, visited = new Set()) => {
      if (visited.has(currentNoteId)) return []; // 防止循环引用
      visited.add(currentNoteId);
      
      const children = notes.filter(note => 
        note.quotedNote && note.quotedNote.id === currentNoteId
      );
      
      let allDescendants = [...children];
      children.forEach(child => {
        allDescendants.push(...getDescendants(child.id, visited));
      });
      
      return allDescendants;
    };
    
    references.ancestors = getAncestors(noteId);
    references.descendants = getDescendants(noteId);
    
    return references;
  };

  // 生成日历
  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const calendar = [];
    
    // 添加空白天数
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push(null);
    }
    
    // 添加实际天数
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayNotes = getNotesForDate(date);
      calendar.push({
        date,
        day,
        hasNotes: dayNotes.length > 0,
        noteCount: dayNotes.length
      });
    }
    
    return calendar;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calendar = generateCalendar();
  const selectedDateNotes = getNotesForDate(selectedDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* 头部 */}
        <div className="mb-8">
          
          {/* 搜索栏 */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索笔记内容或标签..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 视图切换 */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-lg ${viewMode === 'timeline' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
            >
              时间线
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-lg ${viewMode === 'calendar' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border'}`}
            >
              日历视图
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧 - 主内容区 */}
          <div className="lg:col-span-2">
            {/* 写笔记区域 */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  {quotingNote && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Quote className="h-4 w-4 mr-1" />
                        引用笔记
                        <button 
                          onClick={() => setQuotingNote(null)}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-gray-700 text-sm">{quotingNote.content}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTime(quotingNote.timestamp)}
                      </div>
                    </div>
                  )}
                  <textarea
                    placeholder="记录你的想法... (使用 #标签 来分类)"
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <div className="text-sm text-gray-500">
                      {newNote.length}/280
                    </div>
                    <button
                      onClick={createNote}
                      disabled={!newNote.trim()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      发布
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 笔记列表 */}
            {viewMode === 'timeline' && (
              <div className="space-y-4">
                {filteredNotes.map(note => (
                  <div key={note.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                    {/* 引用的笔记 */}
                    {note.quotedNote && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Quote className="h-4 w-4 mr-1" />
                          引用了之前的笔记
                        </div>
                        <p className="text-gray-700 text-sm mb-1">{note.quotedNote.content}</p>
                        <div className="text-xs text-gray-500">
                          {formatTime(note.quotedNote.timestamp)}
                        </div>
                      </div>
                    )}
                    
                    {/* 主要内容 */}
                    <p className="text-gray-800 mb-3 leading-relaxed">{note.content}</p>
                    
                    {/* 标签 */}
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {note.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* 底部操作栏 */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTime(note.timestamp)}
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => quoteNote(note)}
                          className="flex items-center hover:text-blue-500 transition-colors"
                        >
                          <Quote className="h-4 w-4 mr-1" />
                          转发
                        </button>
                        <button
                          onClick={() => {
                            setSelectedNoteId(note.id);
                            setViewMode('detail');
                          }}
                          className="flex items-center hover:text-blue-500 transition-colors"
                        >
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          详情
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 日历视图 */}
            {viewMode === 'calendar' && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月
                  </h3>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendar.map((calendarDay, index) => (
                      <div
                        key={index}
                        className={`p-2 h-12 border rounded cursor-pointer relative ${
                          calendarDay 
                            ? calendarDay.hasNotes 
                              ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                              : 'hover:bg-gray-50'
                            : ''
                        }`}
                        onClick={() => calendarDay && setSelectedDate(calendarDay.date)}
                      >
                        {calendarDay && (
                          <>
                            <span className="text-sm">{calendarDay.day}</span>
                            {calendarDay.hasNotes && (
                              <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* 选中日期的笔记 */}
                <div>
                  <h4 className="font-medium mb-3">
                    {selectedDate.toLocaleDateString('zh-CN')} 的笔记 ({selectedDateNotes.length}条)
                  </h4>
                  <div className="space-y-3">
                    {selectedDateNotes.map(note => (
                      <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-800 mb-2">{note.content}</p>
                        <div className="text-xs text-gray-500">
                          {formatTime(note.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 详情视图 */}
            {viewMode === 'detail' && selectedNoteId && (() => {
              const selectedNote = notes.find(n => n.id === selectedNoteId);
              const references = getNoteReferences(selectedNoteId);
              
              return (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="mb-6">
                    <button
                      onClick={() => setViewMode('timeline')}
                      className="text-blue-500 hover:text-blue-700 mb-4"
                    >
                      ← 返回时间线
                    </button>
                    <h3 className="text-lg font-semibold mb-4">笔记详情</h3>
                  </div>
                  
                  {/* 当前笔记 */}
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 mb-6">
                    <p className="text-gray-800 mb-2">{selectedNote?.content}</p>
                    <div className="text-sm text-gray-600">
                      {formatTime(selectedNote?.timestamp)}
                    </div>
                  </div>
                  
                  {/* 完整引用树 - 重新设计的嵌套结构 */}
                  <div className="space-y-8">
                    {/* 我转发的（被引用的笔记嵌套在里面） */}
                    {references.ancestors.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-4 flex items-center text-lg">
                          <Quote className="h-5 w-5 mr-2 text-orange-500" />
                          我转发的内容
                        </h4>
                        <div className="space-y-4">
                          {(() => {
                            // 从最新的开始，逐层嵌套显示
                            let currentContent = (
                              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                                <div className="text-sm text-orange-600 mb-2 font-medium">📝 原始笔记</div>
                                <p className="text-gray-800 mb-2">{references.ancestors[references.ancestors.length - 1].content}</p>
                                <div className="text-xs text-gray-500">
                                  {formatTime(references.ancestors[references.ancestors.length - 1].timestamp)}
                                </div>
                                <button 
                                  className="mt-2 text-xs text-orange-600 hover:text-orange-800 underline"
                                  onClick={() => setSelectedNoteId(references.ancestors[references.ancestors.length - 1].id)}
                                >
                                  查看详情 →
                                </button>
                              </div>
                            );

                            // 从倒数第二个开始往前嵌套
                            for (let i = references.ancestors.length - 2; i >= 0; i--) {
                              const ancestor = references.ancestors[i];
                              currentContent = (
                                <div key={ancestor.id} className="bg-white border border-orange-200 rounded-lg p-4">
                                  <div className="mb-3">
                                    <div className="text-sm text-orange-600 mb-2 font-medium">
                                      🔄 转发并评论
                                    </div>
                                    <p className="text-gray-800 mb-2">{ancestor.content}</p>
                                    <div className="flex items-center justify-between">
                                      <div className="text-xs text-gray-500">
                                        {formatTime(ancestor.timestamp)}
                                      </div>
                                      <button 
                                        className="text-xs text-orange-600 hover:text-orange-800 underline"
                                        onClick={() => setSelectedNoteId(ancestor.id)}
                                      >
                                        查看详情 →
                                      </button>
                                    </div>
                                  </div>
                                  <div className="ml-4 border-l-2 border-orange-200 pl-4">
                                    <div className="text-xs text-gray-500 mb-2">💬 转发的内容：</div>
                                    {currentContent}
                                  </div>
                                </div>
                              );
                            }

                            return currentContent;
                          })()}
                        </div>
                      </div>
                    )}
                    
                    {/* 转发我的（楼中楼结构） */}
                    {references.descendants.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-4 flex items-center text-lg">
                          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
                          转发我的评论 ({references.descendants.length}条)
                        </h4>
                        
                        {/* 构建楼中楼结构 */}
                        <div className="space-y-4">
                          {(() => {
                            // 构建树形结构
                            const buildTree = (parentId = selectedNoteId, level = 0) => {
                              const children = references.descendants.filter(desc => 
                                desc.quotedNote && desc.quotedNote.id === parentId
                              );
                              
                              return children.map((child, index) => (
                                <div key={child.id} className={`${level > 0 ? 'ml-6' : ''}`}>
                                  <div className={`bg-white border-l-4 ${
                                    level === 0 ? 'border-blue-400' : 
                                    level === 1 ? 'border-green-400' :
                                    level === 2 ? 'border-purple-400' : 'border-gray-400'
                                  } p-4 rounded-r-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
                                    onClick={() => setSelectedNoteId(child.id)}
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <div className={`text-sm font-medium ${
                                        level === 0 ? 'text-blue-600' : 
                                        level === 1 ? 'text-green-600' :
                                        level === 2 ? 'text-purple-600' : 'text-gray-600'
                                      }`}>
                                        {level === 0 ? '💬 一楼' : 
                                         level === 1 ? '↳ 二楼' :
                                         level === 2 ? '↳ 三楼' : `↳ ${level + 1}楼`}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {formatTime(child.timestamp)}
                                      </div>
                                    </div>
                                    
                                    <p className="text-gray-800 mb-2 leading-relaxed">{child.content}</p>
                                    
                                    {child.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mb-2">
                                        {child.tags.map(tag => (
                                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                            #{tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                    
                                    <div className="text-xs text-blue-600 hover:text-blue-800">
                                      点击查看完整详情 →
                                    </div>
                                  </div>
                                  
                                  {/* 递归显示子评论 */}
                                  <div className="mt-2">
                                    {buildTree(child.id, level + 1)}
                                  </div>
                                </div>
                              ));
                            };
                            
                            return buildTree();
                          })()}
                        </div>
                      </div>
                    )}
                    
                    {/* 如果没有任何引用关系 */}
                    {references.ancestors.length === 0 && references.descendants.length === 0 && (
                      <div className="text-center py-12 text-gray-500">
                        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">这条笔记没有引用关系</p>
                        <p className="text-sm mt-2">还没有人转发这条笔记，也没有转发其他笔记</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 右侧 - 统计信息 */}
          <div className="space-y-6">
            {/* 统计卡片 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-4">统计信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">总笔记数</span>
                  <span className="font-medium">{notes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">今日笔记</span>
                  <span className="font-medium">{getNotesForDate(new Date()).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">本月笔记</span>
                  <span className="font-medium">
                    {notes.filter(note => {
                      const noteDate = new Date(note.timestamp);
                      const now = new Date();
                      return noteDate.getMonth() === now.getMonth() && 
                             noteDate.getFullYear() === now.getFullYear();
                    }).length}
                  </span>
                </div>
              </div>
            </div>

            {/* 热门标签 */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold mb-4">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const tagCounts = {};
                  notes.forEach(note => {
                    note.tags.forEach(tag => {
                      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    });
                  });
                  return Object.entries(tagCounts)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 10)
                    .map(([tag, count]) => (
                      <span 
                        key={tag} 
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-pointer hover:bg-blue-200"
                        onClick={() => setSearchTerm(tag)}
                      >
                        #{tag} ({count})
                      </span>
                    ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlomoApp;