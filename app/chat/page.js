'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { detectIntent, executeIntent } from '@/lib/intents';
import Card from '@/components/Card';

export default function ChatPage() {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side only content to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: "Hello! I'm your hospitality assistant. I can help you with housekeeping status, maintenance requests, task assignments, and revenue analytics. What would you like to know?",
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      const intent = detectIntent(message);
      const result = executeIntent(intent, state, dispatch);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: result.response,
        timestamp: new Date(),
        action: result.action
      };

      setMessages(prev => [...prev, botMessage]);
      setIsProcessing(false);

      // Execute navigation if needed
      if (result.action && result.action.type === 'navigate') {
        setTimeout(() => {
          router.push(result.action.path);
        }, 1000);
      }
    }, 1000);
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action);
  };

  const quickActions = [
    "Show me today's housekeeping status",
    "How many maintenance requests are pending?",
    "What is the guest satisfaction score?",
    "What is the occupancy rate this week?",
    "Show RevPAR trends for the past 30 days",
    "Assign cleaning tasks for Room 305",
    "Remind maintenance to check HVAC in Room 202"
  ];

  const insights = [
    {
      title: "High Priority Items",
      items: [
        `${state.metrics.maintenance.open} open maintenance requests`,
        `${state.metrics.housekeeping.maintenanceRequired} rooms need maintenance`,
        `${state.metrics.housekeeping.pending} rooms pending cleaning`
      ]
    },
    {
      title: "Performance Metrics",
      items: [
        `${(state.metrics.aggregate.occupancyRate * 100).toFixed(1)}% occupancy rate`,
        `$${state.metrics.aggregate.adr.toFixed(2)} average daily rate`,
        `${state.guestMetrics.satisfaction}/5.0 guest satisfaction`
      ]
    }
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Get insights and manage tasks through natural language
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Panel */}
        <div className="lg:col-span-2 flex flex-col">
          <Card title="Chat" className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-96">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.action && (
                      <p className="text-xs mt-2 opacity-75">
                        → Navigating to {message.action.path}
                      </p>
                    )}
                    <p className="text-xs mt-1 opacity-75">
                      {isClient ? message.timestamp.toLocaleTimeString() : ''}
                    </p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  placeholder="Ask me about housekeeping, maintenance, or revenue..."
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isProcessing}
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={isProcessing || !inputValue.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="text-left p-3 text-sm bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  disabled={isProcessing}
                >
                  {action}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Insights Panel */}
        <div className="space-y-6">
          <Card title="Current Insights">
            <div className="space-y-4">
              {insights.map((section, index) => (
                <div key={index}>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {section.title}
                  </h4>
                  <ul className="space-y-1">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-600 dark:text-gray-400">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Available Commands">
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>Housekeeping:</strong></p>
              <p>• "Show housekeeping status"</p>
              <p>• "Assign cleaning for Room X"</p>
              
              <p className="pt-2"><strong>Maintenance:</strong></p>
              <p>• "How many pending requests?"</p>
              <p>• "Remind maintenance for Room X"</p>
              
              <p className="pt-2"><strong>Revenue:</strong></p>
              <p>• "What's the occupancy rate?"</p>
              <p>• "Show RevPAR trends"</p>
              
              <p className="pt-2"><strong>Alerts:</strong></p>
              <p>• "Alert when occupancy drops below 70%"</p>
              <p>• "Notify when satisfaction falls below 4.0"</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
