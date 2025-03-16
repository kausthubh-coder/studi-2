"use client";

import React from 'react';

type FunctionCallProps = {
  functionCall: {
    name: string;
    arguments: any;
    result: any;
  };
};

export function FunctionCallResult({ functionCall }: FunctionCallProps) {
  const formatFunctionName = (name: string) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  const renderCourses = (courses: any[]) => {
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
  
  const renderAssignments = (assignments: any[]) => {
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
  
  const renderAnnouncements = (announcements: any[]) => {
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
  
  const renderModules = (modules: any[]) => {
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
    
    if (result.error) {
      return (
        <div className="text-red-500">
          Error: {result.error}
        </div>
      );
    }
    
    switch (name) {
      case "get_courses":
        return renderCourses(result);
      case "get_assignments":
        return renderAssignments(result);
      case "get_announcements":
        return renderAnnouncements(result);
      case "get_modules":
        return renderModules(result);
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