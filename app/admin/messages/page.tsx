'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  MessageSquare, 
  Search, 
  Mail,
  Phone,
  User,
  ArrowLeft,
  Trash2,
  Eye
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const MessagesPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/getMessages');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessages(data.messages);
        } else {
          toast.error(data.message || 'Failed to load messages');
        }
      } else {
        toast.error('Failed to load messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
      toast.success('Message marked as read');
    } catch (error) {
      toast.error('Failed to update message status');
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Message deleted successfully');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter(msg => !msg.isRead).length;

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading messages...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/admin/dashboard" className="flex items-center text-gray-600 hover:text-primary">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-text">Messages</h1>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search */}
          <div className="card mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search messages by name, email, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1">
              <div className="card">
                <h3 className="text-lg font-semibold text-text mb-4">All Messages</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id
                          ? 'bg-primary text-white'
                          : message.isRead
                          ? 'bg-gray-50 hover:bg-gray-100'
                          : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className={`font-medium ${selectedMessage?.id === message.id ? 'text-white' : 'text-text'}`}>
                            {message.name}
                          </h4>
                          <p className={`text-sm ${selectedMessage?.id === message.id ? 'text-blue-100' : 'text-gray-600'}`}>
                            {message.email}
                          </p>
                          <p className={`text-xs ${selectedMessage?.id === message.id ? 'text-blue-100' : 'text-gray-500'}`}>
                            {new Date(message.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {!message.isRead && selectedMessage?.id !== message.id && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <div className="card">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-text">{selectedMessage.name}</h2>
                      <p className="text-gray-600">{selectedMessage.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      {!selectedMessage.isRead && (
                        <button
                          onClick={() => markAsRead(selectedMessage.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {selectedMessage.email}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-text mb-3">Message</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a message</h3>
                    <p className="text-gray-500">Choose a message from the list to view its details.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MessagesPage;
