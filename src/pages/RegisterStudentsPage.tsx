import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Upload, CheckCircle, XCircle, LogOut, UserPlus } from "lucide-react";
import { Button } from "../components/ui/Button";
import lpuLogo from "../assets/lpuLogo.svg";
import { apiService } from "../services/api";

interface StudentData {
  regNo: string;
  name: string;
  dob: string;
}

const RegisterStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [jsonInput, setJsonInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [registeredCount, setRegisteredCount] = useState(0);

  const adminEmail = localStorage.getItem("adminEmail");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/adminLogin");
  };

  const validateStudentData = (data: any[]): { valid: boolean; error?: string } => {
    if (!Array.isArray(data)) {
      return { valid: false, error: "Input must be an array of student objects" };
    }

    if (data.length === 0) {
      return { valid: false, error: "Array cannot be empty" };
    }

    for (let i = 0; i < data.length; i++) {
      const student = data[i];
      
      if (!student.regNo || typeof student.regNo !== "string") {
        return { valid: false, error: `Student at index ${i}: regNo is required and must be a string` };
      }

      if (!student.name || typeof student.name !== "string") {
        return { valid: false, error: `Student at index ${i}: name is required and must be a string` };
      }

      if (!student.dob || typeof student.dob !== "string") {
        return { valid: false, error: `Student at index ${i}: dob is required and must be a string` };
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(student.dob)) {
        return { valid: false, error: `Student at index ${i}: dob must be in YYYY-MM-DD format` };
      }

      // Validate date is valid
      const date = new Date(student.dob);
      if (isNaN(date.getTime())) {
        return { valid: false, error: `Student at index ${i}: dob is not a valid date` };
      }
    }

    return { valid: true };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setRegisteredCount(0);

    if (!jsonInput.trim()) {
      setError("Please paste the student data JSON");
      return;
    }

    let studentsData: StudentData[];
    try {
      studentsData = JSON.parse(jsonInput);
    } catch (err) {
      setError("Invalid JSON format. Please check your input.");
      return;
    }

    const validation = validateStudentData(studentsData);
    if (!validation.valid) {
      setError(validation.error || "Validation failed");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.registerBulkStudents(studentsData);
      setRegisteredCount(response.length);
      setSuccess(`Successfully registered ${response.length} student(s)!`);
      setJsonInput("");
    } catch (err: any) {
      console.error("Bulk registration error:", err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleData = () => {
    const sampleData = [
      {
        regNo: "12216557",
        name: "Shri Niwas",
        dob: "2001-01-01"
      },
      {
        regNo: "12216559",
        name: "Ranjeet Singh",
        dob: "2003-08-09"
      }
    ];
    setJsonInput(JSON.stringify(sampleData, null, 2));
  };

  return (
    <div className="min-h-screen bg-[#FCF1F1] p-4">
      {/* Header Bar */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={lpuLogo} alt="LPU Logo" className="w-12 h-12" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Portal</h2>
              <p className="text-sm text-gray-600">{adminEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/registerAdmin")}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add Admin
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bulk Student Registration
          </h1>
          <p className="text-gray-600">Training & Placement Cell</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Register Students
            </h2>
          </div>

          {/* Instructions */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Paste an array of student objects in JSON format</li>
              <li>Each student must have: regNo, name, and dob (YYYY-MM-DD)</li>
              <li>Example format is provided below</li>
              <li>Click "Load Sample" to see an example</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* JSON Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="jsonInput"
                  className="block text-sm font-medium text-gray-700"
                >
                  Student Data (JSON Array)
                </label>
                <button
                  type="button"
                  onClick={handleSampleData}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Load Sample Data
                </button>
              </div>
              <textarea
                id="jsonInput"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                placeholder='[{"regNo": "12216557", "name": "Shri Niwas", "dob": "2005-01-01"}]'
                rows={12}
                disabled={isLoading}
              />
              <p className="mt-2 text-xs text-gray-500">
                Format: Array of objects with regNo, name, and dob fields
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{success}</p>
                  <p className="text-xs mt-1">
                    {registeredCount} student(s) have been added to the system
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                "Registering Students..."
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Register Students
                </>
              )}
            </Button>
          </form>

          {/* Example Format */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm">
              Expected JSON Format:
            </h3>
            <pre className="text-xs text-gray-700 overflow-x-auto">
{`[
  {
    "regNo": "12216557",
    "name": "Shri Niwas",
    "dob": "2005-01-01"
  },
  {
    "regNo": "1221661",
    "name": "Ranjet Kumar",
    "dob": "2003-08-22"
  }
]`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2025 Lovely Professional University</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterStudentsPage;
