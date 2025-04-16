import React, { createContext, useContext, useState, useEffect } from 'react';
import UAParser from 'ua-parser-js';

export interface VisitorInfo {
  ip: string;
  timestamp: number;
  region?: string;
  city?: string;
  device?: string;
  browser?: string;
  os?: string;
  banned: boolean;
}

type VisitorContextType = {
  visitorCount: number;
  visitors: VisitorInfo[];
  addVisitor: (ip: string) => Promise<void>;
  banVisitor: (ip: string) => void;
  unbanVisitor: (ip: string) => void;
  isIpBanned: (ip: string) => boolean;
  deleteVisitor: (ip: string) => void;
  clearAllVisitors: () => void;
};

const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

export const useVisitors = () => {
  const context = useContext(VisitorContext);
  if (!context) {
    throw new Error('useVisitors must be used within a VisitorProvider');
  }
  return context;
};

export const VisitorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visitors, setVisitors] = useState<VisitorInfo[]>(() => {
    const savedVisitors = localStorage.getItem('visitors');
    return savedVisitors ? JSON.parse(savedVisitors) : [];
  });

  const uniqueVisitors = Array.from(
    new Map(visitors.map(visitor => [visitor.ip, visitor])).values()
  ).sort((a, b) => b.timestamp - a.timestamp);

  const visitorCount = uniqueVisitors.length;

  useEffect(() => {
    localStorage.setItem('visitors', JSON.stringify(visitors));
  }, [visitors]);

  const addVisitor = async (ip: string) => {
    try {
      const existingVisitor = uniqueVisitors.find(v => v.ip === ip);
      if (existingVisitor && Date.now() - existingVisitor.timestamp < 3600000) {
        return;
      }

      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      const geoData = await geoResponse.json();

      const parser = new UAParser();
      const result = parser.getResult();

      const visitorInfo: VisitorInfo = {
        ip,
        timestamp: Date.now(),
        region: geoData.region || 'Unknown',
        city: geoData.city || 'Unknown',
        device: `${result.device.vendor || ''} ${result.device.model || 'Unknown'}`.trim(),
        browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
        os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
        banned: existingVisitor?.banned || false
      };

      setVisitors(prev => [...prev.filter(v => v.ip !== ip), visitorInfo]);
    } catch (error) {
      console.error('Error fetching visitor info:', error);
      const visitorInfo: VisitorInfo = {
        ip,
        timestamp: Date.now(),
        banned: uniqueVisitors.find(v => v.ip === ip)?.banned || false
      };
      setVisitors(prev => [...prev.filter(v => v.ip !== ip), visitorInfo]);
    }
  };

  const banVisitor = (ip: string) => {
    setVisitors(prev => prev.map(visitor => 
      visitor.ip === ip ? { ...visitor, banned: true } : visitor
    ));
  };

  const unbanVisitor = (ip: string) => {
    setVisitors(prev => prev.map(visitor => 
      visitor.ip === ip ? { ...visitor, banned: false } : visitor
    ));
  };

  const deleteVisitor = (ip: string) => {
    setVisitors(prev => prev.filter(visitor => visitor.ip !== ip));
  };

  const clearAllVisitors = () => {
    setVisitors([]);
  };

  const isIpBanned = (ip: string) => {
    return uniqueVisitors.some(visitor => visitor.ip === ip && visitor.banned);
  };

  return (
    <VisitorContext.Provider value={{ 
      visitorCount, 
      visitors: uniqueVisitors,
      addVisitor, 
      banVisitor, 
      unbanVisitor,
      deleteVisitor,
      clearAllVisitors,
      isIpBanned 
    }}>
      {children}
    </VisitorContext.Provider>
  );
};