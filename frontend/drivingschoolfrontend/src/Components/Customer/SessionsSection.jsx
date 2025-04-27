import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { 
  FiInfo, 
  FiXCircle, 
  FiCalendar, 
  FiUser, 
  FiClock, 
  FiBook, 
  FiCheckCircle 
} from "react-icons/fi";

// API URL 
const API_URL = "http://localhost:8080/api";

const SessionsSection = () => {
  // State for sessions
  const [availableSessions, setAvailableSessions] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState(null);
  const [sessionView, setSessionView] = useState("available"); // "available" or "enrolled"
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionDetails, setShowSessionDetails] = useState(false);

  // Fetch sessions when the component mounts or when the view changes
  useEffect(() => {
    fetchSessions();
  }, [sessionView]);

  // Fetch available sessions and user enrollments
  const fetchSessions = async () => {
    setSessionsLoading(true);
    setSessionsError(null);
    
    try {
      if (sessionView === "available") {
        console.log("Fetching available sessions from:", `${API_URL}/customers/sessions/available`);
        // No auth token needed for public endpoint
        const response = await axios.get(`${API_URL}/customers/sessions/available`);
        console.log("Available sessions response:", response.data);
        setAvailableSessions(response.data);
      } else {
        // For authenticated endpoints, we need the token
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        console.log("Using auth token:", token);
    
        if (!token) {
          console.warn("No auth token found in localStorage");
          setSessionsError("Authentication token not found. Please log in again.");
          return;
        }
    
        const headers = { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        
        console.log("Fetching my enrolled sessions from:", `${API_URL}/customers/sessions/my-sessions`);
        const response = await axios.get(`${API_URL}/customers/sessions/my-sessions`, { headers });
        console.log("My enrollments response:", response.data);
        setMyEnrollments(response.data);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      console.log("Error response data:", error.response?.data);
      console.log("Error status:", error.response?.status);
      setSessionsError("Failed to load sessions. Please try again later.");
      
      // For demo/development - mock data if API fails
      if (sessionView === "available") {
        // Mock data for available sessions
        setAvailableSessions([
          {
            id: 1,
            title: "Motorcycle Basic Controls",
            type: "PRACTICAL",
            licenseType: "MOTORCYCLE",
            startTime: "2025-05-01T10:00:00",
            endTime: "2025-05-01T12:00:00",
            currentEnrollment: 3,
            maxCapacity: 5,
            notes: "Please arrive 15 minutes before the session starts. Bring your learner's permit."
          },
          {
            id: 2,
            title: "Road Rules and Signs",
            type: "THEORY",
            licenseType: "ALL",
            startTime: "2025-05-02T14:00:00",
            endTime: "2025-05-02T16:00:00",
            currentEnrollment: 8,
            maxCapacity: 10,
            notes: "Comprehensive review of road rules and traffic signs."
          },
          {
            id: 3,
            title: "Highway Driving Practice",
            type: "PRACTICAL",
            licenseType: "LIGHT_VEHICLE",
            startTime: "2025-05-03T09:00:00",
            endTime: "2025-05-03T12:00:00",
            currentEnrollment: 2,
            maxCapacity: 2,
            notes: "Highway driving session. Must have completed basic training."
          }
        ]);
      } else {
        // Mock data for enrolled sessions
        setMyEnrollments([
          {
            id: 4,
            title: "Parking Techniques",
            type: "PRACTICAL",
            licenseType: "LIGHT_VEHICLE",
            startTime: "2025-05-05T13:00:00",
            endTime: "2025-05-05T15:00:00",
            status: "SCHEDULED",
            notes: "Focus on parallel parking and reverse parking."
          },
          {
            id: 5,
            title: "Defensive Driving",
            type: "THEORY",
            licenseType: "ALL",
            startTime: "2025-04-25T10:00:00",
            endTime: "2025-04-25T12:00:00",
            status: "COMPLETED",
            notes: "Learn techniques to anticipate and avoid hazards."
          }
        ]);
      }
    } finally {
      setSessionsLoading(false);
    }
  };

  // Book a session
  const handleBookSession = async (sessionId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      console.log("Current token:", token);
      
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }
      
      const response = await axios.post(
        `${API_URL}/customers/sessions/enroll`,
        { sessionId },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log("Booking response:", response.data);
      
      if (response.data.successful) {
        alert("Session booked successfully!");
        fetchSessions();
        setSessionView("enrolled");
      } else {
        alert(response.data.message || "Failed to book session");
      }
    } catch (error) {
      console.error("Error booking session:", error);
      console.log("Error details:", error.response?.data);
      alert(error.response?.data?.message || "Failed to book session. Please try again.");
    }
    
    setShowSessionDetails(false);
  };

  // Cancel enrollment
  const handleCancelEnrollment = async (sessionId) => {
    if (window.confirm("Are you sure you want to cancel this session booking?")) {
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        console.log("Using token for cancellation:", token);
        
        if (!token) {
          alert("Authentication token not found. Please log in again.");
          return;
        }
        
        const response = await axios.post(
          `${API_URL}/customers/sessions/cancel/${sessionId}`,
          {},
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        
        console.log("Cancellation response:", response.data);
        
        if (response.data.successful) {
          alert("Booking cancelled successfully!");
          fetchSessions();
        } else {
          alert(response.data.message || "Failed to cancel booking");
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
        console.log("Error details:", error.response?.data);
        alert(error.response?.data?.message || "Failed to cancel booking. Please try again.");
      }
    }
  };

  // View session details
  const openSessionDetails = (session) => {
    setSelectedSession(session);
    setShowSessionDetails(true);
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy h:mm a");
  };

  // Get session type icon
  const getSessionTypeIcon = (type) => {
    switch (type) {
      case "PRACTICAL":
        return <FiClock className="text-green-500" />;
      case "THEORY":
        return <FiBook className="text-blue-500" />;
      case "TEST":
        return <FiCheckCircle className="text-red-500" />;
      default:
        return <FiCalendar />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Tab Navigation */}
      <div className="flex border-b border-gray-700">
        <button
          className={`py-2 px-4 ${
            sessionView === "available"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setSessionView("available")}
        >
          Available Sessions
        </button>
        <button
          className={`py-2 px-4 ${
            sessionView === "enrolled"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setSessionView("enrolled")}
        >
          My Bookings
        </button>
      </div>

      {/* Error Message */}
      {sessionsError && (
        <div className="bg-red-900 border border-red-600 text-white p-3 rounded-md">
          {sessionsError}
        </div>
      )}

      {/* Loading Indicator */}
      {sessionsLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Available Sessions View */}
          {sessionView === "available" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableSessions.length > 0 ? (
                availableSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex justify-between">
                        <div className="flex items-center text-lg font-medium">
                          {getSessionTypeIcon(session.type)}
                          <span className="ml-2">{session.type}</span>
                        </div>
                        <div className="flex items-center">
                          <div className={`h-2 w-2 rounded-full ${
                            session.currentEnrollment < session.maxCapacity 
                              ? "bg-green-500" 
                              : "bg-red-500"
                          } mr-2`}></div>
                          <span className="text-sm">
                            {session.currentEnrollment < session.maxCapacity 
                              ? "Available" 
                              : "Full"}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold mt-2">{session.title}</h3>
                      
                      <div className="mt-3 text-sm text-gray-300">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2" />
                          <span>{formatDateTime(session.startTime)}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <FiUser className="mr-2" />
                          <span>{session.currentEnrollment} / {session.maxCapacity} enrolled</span>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <button
                          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                          onClick={() => openSessionDetails(session)}
                          disabled={session.currentEnrollment >= session.maxCapacity}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center bg-gray-700 rounded-lg">
                  <FiInfo className="mx-auto text-4xl mb-2 text-gray-400" />
                  <p>No available sessions found.</p>
                  <p className="text-gray-400 mt-1">Please check back later for new sessions.</p>
                </div>
              )}
            </div>
          )}

          {/* My Enrollments View */}
          {sessionView === "enrolled" && (
            <div className="bg-gray-700 rounded-lg overflow-hidden">
              {myEnrollments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800">
                        <th className="text-left p-3">Session</th>
                        <th className="text-left p-3">Date & Time</th>
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myEnrollments.map((session) => (
                        <tr key={session.id} className="border-b border-gray-800">
                          <td className="p-3 font-medium">{session.title}</td>
                          <td className="p-3">{formatDateTime(session.startTime)}</td>
                          <td className="p-3">
                            <div className="flex items-center">
                              {getSessionTypeIcon(session.type)}
                              <span className="ml-2">{session.type}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              session.status === "COMPLETED" 
                                ? "bg-green-900 text-green-300" 
                                : session.status === "CANCELLED" 
                                  ? "bg-red-900 text-red-300" 
                                  : "bg-blue-900 text-blue-300"
                            }`}>
                              {session.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <button
                                className="p-1 text-blue-400 hover:text-blue-300"
                                onClick={() => openSessionDetails(session)}
                              >
                                <FiInfo className="text-lg" />
                              </button>
                              {session.status === "SCHEDULED" && (
                                <button
                                  className="p-1 text-red-400 hover:text-red-300"
                                  onClick={() => handleCancelEnrollment(session.id)}
                                >
                                  <FiXCircle className="text-lg" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-10 text-center">
                  <FiInfo className="mx-auto text-4xl mb-2 text-gray-400" />
                  <p>You haven't enrolled in any sessions yet.</p>
                  <p className="text-gray-400 mt-1">Check available sessions to book your training.</p>
                  <button
                    className="mt-4 py-2 px-4 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    onClick={() => setSessionView("available")}
                  >
                    View Available Sessions
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      {/* Session Details Modal */}
      {showSessionDetails && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-5">
              <h2 className="text-xl font-bold mb-4">{selectedSession.title}</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Session Type:</span>
                  <span className="font-medium flex items-center">
                    {getSessionTypeIcon(selectedSession.type)}
                    <span className="ml-2">{selectedSession.type}</span>
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">License Type:</span>
                  <span className="font-medium">{selectedSession.licenseType.replace('_', ' ')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Date & Time:</span>
                  <span className="font-medium">{formatDateTime(selectedSession.startTime)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-medium">
                    {Math.round((new Date(selectedSession.endTime) - new Date(selectedSession.startTime)) / (1000 * 60))} minutes
                  </span>
                </div>
                
                {sessionView === "available" && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Capacity:</span>
                    <span className="font-medium">
                      {selectedSession.currentEnrollment} / {selectedSession.maxCapacity} enrolled
                    </span>
                  </div>
                )}
                
                {selectedSession.notes && (
                  <div>
                    <span className="text-gray-400 block mb-1">Notes:</span>
                    <p className="bg-gray-700 p-2 rounded text-sm">{selectedSession.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between pt-3 border-t border-gray-700">
                <button
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                  onClick={() => setShowSessionDetails(false)}
                >
                  Close
                </button>
                
                {sessionView === "available" && selectedSession.currentEnrollment < selectedSession.maxCapacity && (
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                    onClick={() => handleBookSession(selectedSession.id)}
                  >
                    Book Session
                  </button>
                )}
                
                {sessionView === "enrolled" && selectedSession.status === "SCHEDULED" && (
                  <button
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                    onClick={() => {
                      setShowSessionDetails(false);
                      handleCancelEnrollment(selectedSession.id);
                    }}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsSection;