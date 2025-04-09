"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  BookOpen,
  School,
  Settings,
  Link as LinkIcon,
} from "lucide-react";
import { CanvasHelpInstructions } from "../../components/onboarding/canvas-help";

const OnboardingPage = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    institution: "",
    institutionType: "",
    referralSource: "",
    canvasEnabled: false,
    canvasUrl: "",
    canvasAccessToken: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateOnboardingStatus = useMutation(api.users.updateOnboardingStatus);
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const currentUser = useQuery(api.users.getUser);

  // If user has already completed onboarding, redirect to dashboard
  useEffect(() => {
    if (currentUser && currentUser.onboardingCompleted) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  // Ensure the user exists in Convex when the component loads
  useEffect(() => {
    const ensureUserExists = async () => {
      if (isLoaded && user) {
        try {
          console.log("Creating/updating user in Convex...");
          await createOrUpdateUser({
            name: user.fullName || "Anonymous",
            email: user.primaryEmailAddress?.emailAddress || "",
            imageUrl: user.imageUrl || "",
          });
          console.log("User created/updated successfully");
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    };

    ensureUserExists();
  }, [isLoaded, user, createOrUpdateUser]);

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (!formData.institution) {
        setError("Please enter your institution name");
        return;
      }
      if (!formData.institutionType) {
        setError("Please select your institution type");
        return;
      }
      setError("");
    }

    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setError("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCanvasToggle = (enabled: boolean) => {
    setFormData({
      ...formData,
      canvasEnabled: enabled,
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // Validate Canvas fields if Canvas is enabled
      if (formData.canvasEnabled) {
        if (!formData.canvasUrl) {
          setError("Please enter your Canvas URL");
          setIsSubmitting(false);
          return;
        }

        if (!formData.canvasAccessToken) {
          setError("Please enter your Canvas access token");
          setIsSubmitting(false);
          return;
        }
      }

      // Process Canvas URL if needed
      let canvasUrl = formData.canvasUrl;
      if (
        formData.canvasEnabled &&
        canvasUrl &&
        !canvasUrl.startsWith("http")
      ) {
        canvasUrl = `https://${canvasUrl}`;
      }

      if (!user) {
        setError("You must be signed in to complete onboarding.");
        return;
      }

      // Step 1: Make sure user exists in Convex
      console.log("Creating/updating user record...");
      await createOrUpdateUser({
        name: user.fullName || "Anonymous",
        email: user.primaryEmailAddress?.emailAddress || "",
        imageUrl: user.imageUrl || "",
      });

      // Step 2: Update user profile with onboarding data
      console.log("Updating user profile with onboarding data...");
      try {
        await updateOnboardingStatus({
          onboardingCompleted: true,
          institution: formData.institution,
          institutionType: formData.institutionType,
          referralSource: formData.referralSource,
          canvasEnabled: formData.canvasEnabled,
          canvasUrl: formData.canvasEnabled ? canvasUrl : undefined,
          canvasAccessToken: formData.canvasEnabled
            ? formData.canvasAccessToken
            : undefined,
        });
      } catch (updateError) {
        console.error("Error updating profile:", updateError);

        // Try one more time with a delay
        console.log("Retrying profile update after delay...");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await updateOnboardingStatus({
          onboardingCompleted: true,
          institution: formData.institution,
          institutionType: formData.institutionType,
          referralSource: formData.referralSource,
          canvasEnabled: formData.canvasEnabled,
          canvasUrl: formData.canvasEnabled ? canvasUrl : undefined,
          canvasAccessToken: formData.canvasEnabled
            ? formData.canvasAccessToken
            : undefined,
        });
      }

      console.log("Onboarding completed successfully");

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error in onboarding process:", error);
      setError(
        "There was a problem completing your profile. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🎓</span>
              <h2 className="text-2xl font-bold text-black">
                Welcome to Studi!
              </h2>
            </div>
            <p className="text-black">Tell us about yourself to get started.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-1 flex items-center">
                  <School className="w-4 h-4 mr-2 text-black" />
                  What type of institution do you attend?
                </label>
                <select
                  name="institutionType"
                  value={formData.institutionType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-black rounded-md bg-white text-black"
                >
                  <option value="">Select institution type</option>
                  <option value="university">University</option>
                  <option value="college">College</option>
                  <option value="high_school">High School</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-1 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2 text-black" />
                  Name of your institution
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="e.g., Stanford University"
                  className="w-full px-4 py-2 border-2 border-black rounded-md bg-white text-black placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-1 flex items-center">
                  <Info className="w-4 h-4 mr-2 text-black" />
                  How did you hear about Studi?
                </label>
                <select
                  name="referralSource"
                  value={formData.referralSource}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border-2 border-black rounded-md bg-white text-black"
                >
                  <option value="">Select an option</option>
                  <option value="search">Search Engine 🔍</option>
                  <option value="social">Social Media 📱</option>
                  <option value="friend">Friend or Colleague 👋</option>
                  <option value="teacher">Teacher/Professor 👩‍🏫</option>
                  <option value="other">Other 🔄</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🔄</span>
              <h2 className="text-2xl font-bold text-black">
                Canvas Integration
              </h2>
            </div>
            <p className="text-black">
              Connect with Canvas to access your courses and assignments.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-black flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2 text-black" />
                  Enable Canvas Integration
                </span>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => handleCanvasToggle(true)}
                    className={`px-4 py-2 rounded-md border-2 ${formData.canvasEnabled ? "bg-black text-white border-black" : "bg-white text-gray-700 border-black"}`}
                  >
                    Yes ✅
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCanvasToggle(false)}
                    className={`px-4 py-2 rounded-md border-2 ${!formData.canvasEnabled ? "bg-black text-white border-black" : "bg-white text-gray-700 border-black"}`}
                  >
                    No ❌
                  </button>
                </div>
              </div>

              {formData.canvasEnabled && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-1 flex items-center">
                      <Settings className="w-4 h-4 mr-2 text-black" />
                      Canvas URL
                    </label>
                    <input
                      type="text"
                      name="canvasUrl"
                      value={formData.canvasUrl}
                      onChange={handleInputChange}
                      placeholder="https://your-institution.instructure.com"
                      className="w-full px-4 py-2 border-2 border-black rounded-md bg-white text-black placeholder-gray-500"
                    />
                    <p className="text-xs text-black mt-1">
                      Enter your Canvas instance URL (e.g.,
                      https://your-institution.instructure.com)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-1 flex items-center">
                      <LinkIcon className="w-4 h-4 mr-2 text-black" />
                      Canvas Access Token
                    </label>
                    <input
                      type="password"
                      name="canvasAccessToken"
                      value={formData.canvasAccessToken}
                      onChange={handleInputChange}
                      placeholder="Your Canvas API access token"
                      className="w-full px-4 py-2 border-2 border-black rounded-md bg-white text-black placeholder-gray-500"
                    />
                    <p className="text-xs text-black mt-1">
                      Generate an access token in Canvas: Account → Settings →
                      Approved Integrations
                    </p>
                  </div>

                  <CanvasHelpInstructions />
                </>
              )}

              {!formData.canvasEnabled && (
                <div className="bg-blue-50 p-4 rounded-md border-2 border-black">
                  <p className="text-sm text-black flex items-center">
                    <Info className="w-4 h-4 mr-2 text-black" />
                    You can always set up Canvas integration later in Settings.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-16 h-16 border-2 border-black rounded-full flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="text-2xl font-bold text-black">You're all set!</h2>
            <p className="text-black">
              Thanks for completing your profile. You're ready to start using
              Studi! 🚀
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-black">Studi 📚</h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border-2 border-black sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="flex items-center text-sm text-black hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-1 text-black" />
                  Back
                </button>
              )}
              <div className="flex space-x-2">
                <span
                  className={`${currentStep >= 1 ? "text-black" : "text-gray-300"}`}
                >
                  📋
                </span>
                <span
                  className={`${currentStep >= 2 ? "text-black" : "text-gray-300"}`}
                >
                  🔗
                </span>
                <span
                  className={`${currentStep >= 3 ? "text-black" : "text-gray-300"}`}
                >
                  🎉
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 border border-black">
              <div
                style={{ width: `${(currentStep / 3) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-black"
              ></div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 rounded-md text-black text-sm flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <div className="space-y-6">
            {renderStepContent()}

            <div className="flex justify-end">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="inline-flex items-center px-4 py-2 border-2 border-black rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
                >
                  Next
                  <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border-2 border-black rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving... ⏳" : "Get Started 🚀"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;



