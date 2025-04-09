"use client";

import React from 'react';

// Define specific types for each data structure
interface Course {
  id: string;
  name: string;
}

interface Assignment {
  id: string;
  name: string;
  due_at?: string;
}

interface Announcement {
  id: string;
  title: string;
  posted_at?: string;
}

interface Module {
  id: string;
  name: string;
}

// Define function result type
type FunctionResult = Course[] | Assignment[] | Announcement[] | Module[] | { error?: string } | unknown;

type FunctionCallProps = {
  functionCall: {
    name: string;
    arguments: Record<string, unknown>;
    result: FunctionResult;
  };
};

export function FunctionCallResult({ functionCall }: FunctionCallProps) {
  const formatFunctionName = (name: string) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  const renderCourses = (courses: Course[]) => {
    if (!Array.isArray(courses) || courses.length === 0) {
      return <p className="text-gray-500">No courses found</p>;
    }
    
    return (
      <div className="mt-2">
        <h4 className="font-bold">Your Courses:</h4>
        <ul className="list-disc pl-5 mt-1">
          {courses.map((course) => (
            <li key={course.id} className="mb-1">
              <span className="font-medium">{course.name}</span> 
              <span className="text-xs text-gray-500 ml-1">(ID: {course.id})</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  const renderAssignments = (assignments: Assignment[]) => {
    if (!Array.isArray(assignments) || assignments.length === 0) {
      return <p className="text-gray-500">No assignments found</p>;
    }
    
    return (
      <div className="mt-2">
        <h4 className="font-bold">Assignments:</h4>
        <ul className="list-disc pl-5 mt-1">
          {assignments.map((assignment) => (
            <li key={assignment.id} className="mb-1">
              <span className="font-medium">{assignment.name}</span>
              {assignment.due_at && (
                <span className="text-xs text-gray-500 ml-1">
                  Due: {new Date(assignment.due_at).toLocaleDateString()}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  const renderAnnouncements = (announcements: Announcement[]) => {
    if (!Array.isArray(announcements) || announcements.length === 0) {
      return <p className="text-gray-500">No announcements found</p>;
    }
    
    return (
      <div className="mt-2">
        <h4 className="font-bold">Announcements:</h4>
        <ul className="list-disc pl-5 mt-1">
          {announcements.map((announcement) => (
            <li key={announcement.id} className="mb-1">
              <span className="font-medium">{announcement.title}</span>
              {announcement.posted_at && (
                <span className="text-xs text-gray-500 ml-1">
                  Posted: {new Date(announcement.posted_at).toLocaleDateString()}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  const renderModules = (modules: Module[]) => {
    if (!Array.isArray(modules) || modules.length === 0) {
      return <p className="text-gray-500">No modules found</p>;
    }
    
    return (
      <div className="mt-2">
        <h4 className="font-bold">Modules:</h4>
        <ul className="list-disc pl-5 mt-1">
          {modules.map((module) => (
            <li key={module.id} className="mb-1">
              <span className="font-medium">{module.name}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  const renderFunctionResult = () => {
    const { name, result } = functionCall;
    
    if (typeof result === 'object' && result !== null && 'error' in result) {
      return (
        <div className="text-red-500">
          Error: {(result as { error: string }).error}
        </div>
      );
    }
    
    switch (name) {
      case "get_courses":
        return renderCourses(result as Course[]);
      case "get_assignments":
        return renderAssignments(result as Assignment[]);
      case "get_announcements":
        return renderAnnouncements(result as Announcement[]);
      case "get_modules":
        return renderModules(result as Module[]);
      default:
        return (
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        );
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-md p-3 bg-gray-50 my-2">
      <div className="font-medium text-gray-700">
        {formatFunctionName(functionCall.name)}
      </div>
      {renderFunctionResult()}
    </div>
  );
} 


