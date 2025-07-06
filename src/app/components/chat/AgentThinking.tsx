"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, Eye, CheckCircle, Clock, Activity } from "lucide-react";

interface AgentStep {
  thought: string;
  action: string;
  actionInput: any;
  observation: string;
  stepNumber: number;
  timestamp: number;
}

interface AgentThinkingProps {
  isActive: boolean;
  steps?: AgentStep[];
  currentStep?: number;
  className?: string;
}

export function AgentThinking({ isActive, steps = [], currentStep = 0, className = "" }: AgentThinkingProps) {
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsThinking(true);
      // Simulate progressive revelation of steps
      const interval = setInterval(() => {
        setVisibleSteps((prev: number) => {
          if (prev < steps.length) {
            return prev + 1;
          }
          return prev;
        });
      }, 2000);

      return () => clearInterval(interval);
    } else {
      setIsThinking(false);
      setVisibleSteps(steps.length);
    }
  }, [isActive, steps.length]);

  const getStepIcon = (action: string) => {
    if (action === "Final Answer") return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (action.includes("get_")) return <Eye className="w-4 h-4 text-blue-500" />;
    return <Zap className="w-4 h-4 text-purple-500" />;
  };

  const getActionColor = (action: string) => {
    if (action === "Final Answer") return "text-green-600 bg-green-50 border-green-200";
    if (action.includes("get_")) return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-purple-600 bg-purple-50 border-purple-200";
  };

  if (!isActive && steps.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white border-2 border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ rotate: isThinking ? 360 : 0 }}
          transition={{ duration: 2, repeat: isThinking ? Infinity : 0, ease: "linear" }}
        >
          <Brain className="w-5 h-5 text-indigo-600" />
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-900">
          {isThinking ? "Agent is thinking..." : "Agent Reasoning Complete"}
        </h3>
        {isThinking && (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Activity className="w-4 h-4 text-indigo-500" />
          </motion.div>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {steps.slice(0, visibleSteps).map((step, index) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border-l-4 border-indigo-200 pl-4 py-2 bg-gray-50 rounded-r-lg"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-medium text-indigo-600">
                    {step.stepNumber}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Thought */}
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Brain className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Thought:</span>
                    </div>
                    <p className="text-sm text-gray-600 italic pl-6">
                      {step.thought}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      {getStepIcon(step.action)}
                      <span className="text-sm font-medium text-gray-700">Action:</span>
                    </div>
                    <div className="pl-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionColor(step.action)}`}>
                        {step.action}
                      </span>
                      {step.actionInput && typeof step.actionInput === 'object' && (
                        <div className="mt-1 text-xs text-gray-500 font-mono">
                          {JSON.stringify(step.actionInput, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Observation */}
                  {step.observation && step.action !== "Final Answer" && (
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Observation:</span>
                      </div>
                      <div className="pl-6">
                        <details className="group">
                          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 transition-colors">
                            {step.observation.length > 100 
                              ? `${step.observation.substring(0, 100)}...` 
                              : step.observation}
                          </summary>
                          <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono text-gray-700 max-h-32 overflow-y-auto">
                            {step.observation}
                          </div>
                        </details>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(step.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator for current step */}
        {isThinking && visibleSteps < steps.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-l-4 border-gray-300 pl-4 py-2 bg-gray-50 rounded-r-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"
                />
              </div>
              <div className="text-sm text-gray-600">
                Processing next step...
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Summary */}
      {!isThinking && steps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Analysis Complete</span>
          </div>
          <p className="text-sm text-indigo-700">
            Completed {steps.length} reasoning steps to provide you with a comprehensive response.
          </p>
        </motion.div>
      )}
    </div>
  );
}