import React, { useState, useEffect } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Avatar
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import robotGif from '../assets/StudyHub Bot.gif';

const StudyHubChatBot = () => {
  const AI_AVATAR = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";
  const USER_AVATAR = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
  
  const [messages, setMessages] = useState([
    {
      message: "Hello! I'm StudyHub Assist. How can I help with your studies today?",
      sentTime: "just now",
      sender: "AI",
      direction: "incoming",
      position: "single",
      avatar: AI_AVATAR
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    const messageListContainer = document.querySelector('.message-list-container');
    if (messageListContainer) {
      messageListContainer.scrollTop = messageListContainer.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (messageText) => {
    // CRITICAL iOS FIX: Add input validation
    if (!messageText || typeof messageText !== 'string') {
      console.error('Invalid message text');
      return;
    }

    const userMessage = {
      message: messageText,
      sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: "user",
      direction: "outgoing",
      position: "single",
      avatar: USER_AVATAR
    };
    
    // CRITICAL iOS FIX: Safe state update with array validation
    setMessages(prev => {
      if (!Array.isArray(prev)) return [userMessage];
      return [...prev, userMessage];
    });
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(messageText);
      
      const aiMessage = {
        message: aiResponse,
        sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: "StudyHub",
        direction: "incoming",
        position: "single",
        avatar: AI_AVATAR
      };
      
      // CRITICAL iOS FIX: Safe state update
      setMessages(prev => {
        if (!Array.isArray(prev)) return [aiMessage];
        return [...prev, aiMessage];
      });
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        message: "Sorry, I'm having trouble responding. Please try again later.",
        sender: "StudyHub",
        direction: "incoming",
        position: "single",
        avatar: AI_AVATAR
      };
      
      setMessages(prev => {
        if (!Array.isArray(prev)) return [errorMessage];
        return [...prev, errorMessage];
      });
    } finally {
      setIsTyping(false);
    }
  };

  const getAIResponse = async (message) => {
    // CRITICAL iOS FIX: Add input validation
    if (!message || typeof message !== 'string') {
      throw new Error('Invalid message input');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const studyResponses = [
      `For "${message}", check Chapter 3 of your textbook.`,
      `Regarding ${message}, focus on: 1) Core concepts 2) Examples`,
      `I found resources that might help: [Guide] [Video]`,
      `For ${message}, join our study group Wednesdays at 4pm.`,
      `Professor's video lectures explain ${message} well.`
    ];
    
    // CRITICAL iOS FIX: Safe array access with validation
    if (!Array.isArray(studyResponses) || studyResponses.length === 0) {
      return "I'm here to help with your studies!";
    }
    
    const randomIndex = Math.floor(Math.random() * studyResponses.length);
    return studyResponses[randomIndex] || "I'm here to help with your studies!";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Robot GIF Trigger */}
      {!showChat && (
        <div 
          onClick={() => setShowChat(true)}
          className="cursor-pointer hover:scale-105 transition-transform"
          title="Ask StudyHub Assist"
        >
          <img 
            src={robotGif} 
            alt="StudyHub Assist" 
            className="w-24 h-24 object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <p className="text-center text-sm font-medium text-blue-600 mt-1">StudyHub Assist</p>
        </div>
      )}

      {/* Chat Window */}
      {showChat && (
        <div className="w-80 h-[500px] bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src={robotGif} 
                alt="StudyHub Assist" 
                className="w-8 h-8 rounded-full mr-2 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <span className="font-semibold">StudyHub Assist</span>
            </div>
            <button 
              onClick={() => setShowChat(false)}
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Message Area */}
          <div className="message-list-container flex-1 overflow-auto">
            <MainContainer>
              <ChatContainer>
                <MessageList
                  typingIndicator={isTyping && <TypingIndicator content="Searching study resources..." />}
                >
                  {/* CRITICAL iOS FIX: Safe array rendering with validation */}
                  {Array.isArray(messages) && messages.length > 0 && messages.map((msg, index) => {
                    // Additional safety check for each message
                    if (!msg || typeof msg !== 'object') return null;
                    
                    return (
                      <Message
                        key={`message-${index}`}
                        model={msg}
                        avatarPosition={msg.sender === "AI" ? "tl" : "tr"}
                      >
                        <Avatar src={msg.avatar || AI_AVATAR} />
                        <Message.Footer 
                          sentTime={msg.sentTime || 'now'} 
                          sender={msg.sender === "AI" ? "StudyHub" : "You"}
                        />
                      </Message>
                    );
                  })}
                </MessageList>
              </ChatContainer>
            </MainContainer>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-2 bg-white">
            <MessageInput
              placeholder="Ask about study materials..."
              onSend={handleSend}
              attachButton={false}
              disabled={isTyping}
              sendButton={true}
              autoFocus={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyHubChatBot;