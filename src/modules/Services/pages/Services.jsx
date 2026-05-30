import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MapPin,
  Clock,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
  Scissors,
  Sparkles,
  Smile,
  Footprints,
  Heart,
  User,
  Dumbbell,
  Flower2,
  Zap,
  MoreHorizontal,
  Info,
  ChevronRight,
  Save,
  Eye,
} from "lucide-react";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import useNetwork from "../../../hooks/useNetwork";
import { formatCurrency } from "../../../utils/formatters";
import clsx from "clsx";

const CATEGORIES = [
  { id: "Consulting", label: "Consulting", icon: User, color: "#0F8C55" },
  { id: "Lessons", label: "Lessons", icon: Zap, color: "#FF9500" },
  { id: "Events", label: "Events", icon: Sparkles, color: "#FFD600" },
  { id: "Performance", label: "Performance", icon: Heart, color: "#FF4D8D" },
  { id: "Photography", label: "Photography", icon: Eye, color: "#00D1FF" },
  { id: "Hair & Beauty", label: "Hair & Beauty", icon: Scissors, color: "#B54DFF" },
  { id: "Fitness", label: "Fitness", icon: Dumbbell, color: "#FF3B30" },
  { id: "Therapy", label: "Therapy", icon: User, color: "#AF52DE" },
];

const CLIENT_QUESTIONS = [
  "Preferred date/time",
  "Number of attendees",
  "Session duration",
  "Event location",
  "Online or In-Person?",
  "Special requests",
  "Pre-requirements",
  "Reference links/files",
  "Preferred style",
  "Age of attendee(s)",
  "Experience level (Beginner/Intermediate/Advanced)",
  "Topic/Focus area",
  "Budget range",
  "Any allergies/conditions?",
  "Client's phone/email",
];

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const Services = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const isOnline = useNetwork();

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [schedule, setSchedule] = useState([]);
  const [loadingHours, setLoadingHours] = useState(true);
  const [savingHours, setSavingHours] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "Consulting",
    description: "",
    price: "",
    duration: 60,
    is_negotiable: false,
    happy_price: "",
    lowest_price: "",
    deposit_type: "none",
    deposit_value: "",
    service_type: "in_shop",
    client_questions: [],
    is_active: true,
  });

  const [customQuestion, setCustomQuestion] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  useEffect(() => {
    fetchServices();
    fetchSchedule();
  }, []);

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const response = await api.get("/api/services/");
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Fetch services error:", error);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchSchedule = async () => {
    try {
      setLoadingHours(true);
      const response = await api.get("/api/services/schedule");
      setSchedule(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Fetch schedule error:", error);
    } finally {
      setLoadingHours(false);
    }
  };

  const handleUpdateDay = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  const handleSaveHours = async () => {
    setSavingHours(true);
    try {
      await api.post("/api/services/schedule", schedule);
      addToast("Hours saved successfully", "success");
    } catch (error) {
      addToast("Failed to save hours", "error");
    } finally {
      setSavingHours(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        lowest_price: formData.is_negotiable
          ? parseFloat(formData.lowest_price)
          : null,
        happy_price: formData.is_negotiable
          ? parseFloat(formData.happy_price)
          : null,
        deposit_value:
          formData.deposit_type !== "none"
            ? parseFloat(formData.deposit_value)
            : null,
      };

      if (editingService) {
        await api.put(`/api/services/${editingService.id}`, payload);
        addToast("Service updated", "success");
      } else {
        await api.post("/api/services/", payload);
        addToast("Service added", "success");
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (error) {
      addToast("Failed to save service", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/api/services/${serviceToDelete.id}`);
      addToast("Service removed", "success");
      setServiceToDelete(null);
      fetchServices();
    } catch (error) {
      addToast("Delete failed", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name || "",
        category: service.category || "Consulting",
        description: service.description || "",
        price: service.price || "",
        duration: service.duration || 60,
        is_negotiable: service.is_negotiable || false,
        happy_price: service.happy_price || "",
        lowest_price: service.lowest_price || "",
        deposit_type: service.deposit_type || "none",
        deposit_value: service.deposit_value || "",
        service_type: service.service_type || "in_shop",
        client_questions: Array.isArray(service.client_questions)
          ? service.client_questions
          : [],
        is_active: service.is_active !== undefined ? service.is_active : true,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        category: "Consulting",
        description: "",
        price: "",
        duration: 60,
        is_negotiable: false,
        happy_price: "",
        lowest_price: "",
        deposit_type: "none",
        deposit_value: "",
        service_type: "in_shop",
        client_questions: [],
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const addCustomQuestion = () => {
    if (!customQuestion.trim()) return;
    if (!formData.client_questions.includes(customQuestion.trim())) {
      setFormData({
        ...formData,
        client_questions: [...formData.client_questions, customQuestion.trim()],
      });
    }
    setCustomQuestion("");
  };

  const removeQuestion = (q) => {
    setFormData({
      ...formData,
      client_questions: formData.client_questions.filter((item) => item !== q),
    });
  };

  const toggleQuestion = (q) => {
    const questions = [...formData.client_questions];
    if (questions.includes(q)) {
      removeQuestion(q);
    } else {
      setFormData({ ...formData, client_questions: [...questions, q] });
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">
            Services & Schedule
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your offerings and operating hours in one place.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-primary hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          <Plus size={20} /> Add New Service
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SERVICES LIST - LEFT 8 COLUMNS */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-dark dark:text-white">
                Active Services
              </h3>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {services.length} Listed
              </span>
            </div>

            {loadingServices ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="py-12 text-center bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Plus size={24} />
                </div>
                <p className="text-gray-500 font-medium">
                  No services found. Add your first service to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => {
                  const categoryObj =
                    CATEGORIES.find((c) => c.id === service.category) ||
                    CATEGORIES[0];
                  return (
                    <div
                      key={service.id}
                      className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm shrink-0">
                          <categoryObj.icon
                            size={20}
                            style={{ color: categoryObj.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-dark dark:text-white truncate">
                              {service.name}
                            </h4>
                            <span className="font-black text-primary text-sm whitespace-nowrap">
                              {service.price >= 1000 
                                ? `₦${(service.price / 1000).toFixed(0)}k` 
                                : `₦${service.price.toLocaleString()}`}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tight mt-0.5">
                            {service.category} · {service.duration} MIN
                          </p>

                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => openModal(service)}
                              className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-400 hover:text-primary transition-colors border border-gray-100 dark:border-gray-600 shadow-sm"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setServiceToDelete(service)}
                              className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-400 hover:text-red-500 transition-colors border border-gray-100 dark:border-gray-600 shadow-sm"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* OPERATING HOURS - RIGHT 4 COLUMNS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Clock size={18} />
              <h3 className="font-bold text-dark dark:text-white">
                Operating Hours
              </h3>
            </div>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              AI uses these hours to offer booking slots to clients.
            </p>

            {loadingHours ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {schedule.map((day, index) => (
                  <div
                    key={index}
                    className={clsx(
                      "flex items-center justify-between p-3 rounded-xl border transition-all",
                      day.is_active
                        ? "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm"
                        : "bg-transparent border-transparent opacity-40",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 font-bold text-xs text-gray-500">
                        {DAYS_OF_WEEK[day.day_of_week].slice(0, 3)}
                      </span>
                      {day.is_active ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="time"
                            value={day.start_time}
                            onChange={(e) =>
                              handleUpdateDay(
                                index,
                                "start_time",
                                e.target.value,
                              )
                            }
                            className="bg-transparent border-none p-0 text-xs font-bold text-dark dark:text-white focus:ring-0 w-16"
                          />
                          <span className="text-[10px] text-gray-400 font-bold">
                            -
                          </span>
                          <input
                            type="time"
                            value={day.end_time}
                            onChange={(e) =>
                              handleUpdateDay(index, "end_time", e.target.value)
                            }
                            className="bg-transparent border-none p-0 text-xs font-bold text-dark dark:text-white focus:ring-0 w-16"
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase text-gray-400">
                          Closed
                        </span>
                      )}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer scale-75">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={day.is_active}
                        onChange={(e) =>
                          handleUpdateDay(index, "is_active", e.target.checked)
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleSaveHours}
              disabled={savingHours || loadingHours}
              className="w-full bg-primary hover:bg-green-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {savingHours ? (
                "Saving..."
              ) : (
                <>
                  <Save size={16} /> Save Hours
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SERVICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
              <h3 className="text-xl font-bold text-dark dark:text-white">
                {editingService ? "Edit Service" : "New Service"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. 1-on-1 Music Lesson or Consulting Session"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-dark dark:text-white text-sm focus:bg-white dark:focus:bg-gray-700 focus:border-primary focus:ring-0 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Service Price (₦)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="17000"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-dark dark:text-white text-sm focus:bg-white dark:focus:bg-gray-700 focus:border-primary focus:ring-0 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-dark dark:text-white text-sm focus:bg-white dark:focus:bg-gray-700 focus:border-primary focus:ring-0 transition-all"
                  />
                </div>
              </div>

              {/* Negotiation Toggle */}
              <div className="flex items-center gap-3 py-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_negotiable}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_negotiable: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <span className="text-sm font-medium text-dark dark:text-white">
                  Allow Negotiation
                </span>
              </div>

              {formData.is_negotiable && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800/30">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Happy Price (₦)
                    </label>
                    <input
                      type="number"
                      value={formData.happy_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          happy_price: e.target.value,
                        })
                      }
                      placeholder="14500"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-dark dark:text-white text-sm focus:border-primary focus:ring-0 transition-all"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Your target close price
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Last Price (₦)
                    </label>
                    <input
                      type="number"
                      value={formData.lowest_price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lowest_price: e.target.value,
                        })
                      }
                      placeholder="12000"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-dark dark:text-white text-sm focus:border-primary focus:ring-0 transition-all"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Absolute floor — AI rarely goes here
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, category: cat.id });
                        setShowCustomCategory(false);
                      }}
                      className={clsx(
                        "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                        formData.category === cat.id && !showCustomCategory
                          ? "bg-primary text-white border-primary shadow-md shadow-green-100"
                          : "bg-white dark:bg-gray-700 text-gray-500 border-gray-100 dark:border-gray-600",
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowCustomCategory(true)}
                    className={clsx(
                      "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                      showCustomCategory
                        ? "bg-primary text-white border-primary shadow-md shadow-green-100"
                        : "bg-white dark:bg-gray-700 text-gray-500 border-gray-100 dark:border-gray-600",
                    )}
                  >
                    Other...
                  </button>
                </div>
                {showCustomCategory && (
                  <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Enter custom category"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-primary/50 text-dark dark:text-white text-sm focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-dark dark:text-white flex items-center gap-2">
                  <Zap size={16} className="text-primary" /> AI Agent Questions
                </h4>
                <p className="text-xs text-gray-500">
                  What info should Kasi collect from the client before booking?
                </p>
                <div className="space-y-4">
                  {/* Selected Questions as Pills */}
                  {formData.client_questions.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-white dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
                      {formData.client_questions.map((q) => (
                        <span key={q} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black flex items-center gap-2 border border-primary/20">
                          {q}
                          <button type="button" onClick={() => removeQuestion(q)} className="hover:text-red-500 transition-colors">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Input for custom questions */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomQuestion())}
                      placeholder="Ask for: Skin type, Preferred color, etc."
                      className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 text-xs font-medium focus:border-primary transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={addCustomQuestion}
                      disabled={!customQuestion.trim()}
                      className="px-4 bg-dark text-white rounded-xl text-xs font-bold hover:bg-black disabled:opacity-50 transition-all"
                    >
                      Add
                    </button>
                  </div>

                  {/* Suggestions Grid */}
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Suggestions</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {CLIENT_QUESTIONS.slice(0, 9).map((q) => (
                        <button
                          key={q}
                          type="button"
                          disabled={formData.client_questions.includes(q)}
                          onClick={() => toggleQuestion(q)}
                          className={clsx(
                            "px-3 py-2 rounded-lg text-[10px] font-bold text-left transition-all border truncate",
                            formData.client_questions.includes(q)
                              ? "bg-gray-50 text-gray-300 border-gray-100"
                              : "bg-white dark:bg-gray-700 border-gray-100 dark:border-gray-600 text-gray-400 hover:border-primary/30",
                          )}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-4 bg-primary hover:bg-green-700 text-white rounded-2xl font-bold shadow-lg shadow-green-100 transition-all disabled:opacity-50 mt-4"
              >
                {isSaving
                  ? "Saving..."
                  : editingService
                    ? "Update Service"
                    : "Add Service"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE DIALOG */}
      {serviceToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-800 rounded-[32px] p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-dark dark:text-white mb-2">
              Delete Service?
            </h3>
            <p className="text-sm text-gray-500 mb-8">
              This will permanently remove{" "}
              <span className="font-bold text-dark dark:text-white">
                "{serviceToDelete.name}"
              </span>
              .
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setServiceToDelete(null)}
                className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-red-700 transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(15, 140, 85, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(15, 140, 85, 0.2); }
      `}</style>
    </div>
  );
};

export default Services;
