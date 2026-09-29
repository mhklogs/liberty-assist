import React, { useState, useEffect, useRef } from 'react';
import { 
  Scale, 
  Landmark, 
  User, 
  ShieldCheck, 
  HeartPulse, 
  FileText, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Type, 
  HelpCircle, 
  CheckSquare, 
  Settings, 
  ChevronRight, 
  Download, 
  Printer, 
  Copy, 
  RotateCcw, 
  AlertTriangle, 
  ArrowRight, 
  BookOpen, 
  Calculator, 
  Calendar,
  Sparkles,
  Info,
  CheckCircle2,
  Trash2,
  Lock,
  Mail,
  UserCheck,
  LogOut,
  FolderOpen,
  Award,
  Globe,
  FileCheck,
  Brain,
  Image as ImageIcon,
  Eye,
  Plus,
  TrendingUp,
  Camera,
  Upload,
  Clock,
  Briefcase
} from 'lucide-react';
import './App.css';
import { getSupabaseClient, mockSupabase } from './supabaseClient';

const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' }, 
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' }, 
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' }, 
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' }, 
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' }, 
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' }, 
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' }, 
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' }, 
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' }, 
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' }, 
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' }, 
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' }, 
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' }, 
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' }, 
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' }, 
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' }, 
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
];

const USER_ROLES = [
  { value: 'citizen', label: '🇺🇸 US General Citizen', desc: 'Standard legal, financial, and civic helpers.' },
  { value: 'lawyer', label: '💼 US Attorney / Lawyer', desc: 'ABA ethics, CLE trackers, fee estimators, court finders.' },
  { value: 'doctor', label: '🩺 Medical Professional', desc: 'HIPAA checklists, licensing boards, and DEA registries.' },
  { value: 'refugee', label: '🕊️ Refugee / Asylum Seeker', desc: 'Form I-589 assistance, work card guides, resettlement aids.' },
  { value: 'immigrant', label: '🗺️ Immigrant (Visa / GC)', desc: 'USCIS naturalization tests, Green Card forms, visa trackers.' },
  { value: 'senior', label: '👵 Senior Citizen (65+)', desc: 'Medicare guidelines, retirement payouts, elder rights help.' },
  { value: 'student', label: '🎓 Student / Youth', desc: 'FAFSA advisors, student loan planners, college budgeting.' }
];

const OFFICIAL_CIVICS_QUESTIONS = [
  {
    question: "What is the supreme law of the land?",
    options: ["The Declaration of Independence", "The Constitution", "The Articles of Confederation", "The Bill of Rights"],
    answer: "The Constitution"
  },
  {
    question: "What does the Constitution do?",
    options: ["Protects basic rights of Americans", "Sets up the government", "Defines the government", "All of these options"],
    answer: "All of these options"
  },
  {
    question: "Who is the \"Father of Our Country\"?",
    options: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "Benjamin Franklin"],
    answer: "George Washington"
  },
  {
    question: "How many amendments does the Constitution have?",
    options: ["10", "21", "27", "50"],
    answer: "27"
  },
  {
    question: "We elect a U.S. Senator for how many years?",
    options: ["2", "4", "6", "8"],
    answer: "6"
  },
  {
    question: "What is one promise you make when you become a United States citizen?",
    options: ["Never leave the country", "Obey the laws of the United States", "Register to vote", "Support a political party"],
    answer: "Obey the laws of the United States"
  }
];

const STUDY_FLASHCARDS = [
  { term: "Bill of Rights", def: "The first ten amendments to the US Constitution, guaranteeing individual liberties." },
  { term: "Executive Branch", def: "The branch of government (headed by the President) responsible for enforcing laws." },
  { term: "Federalism", def: "A system of government where power is shared between the national government and state governments." },
  { term: "Bicameral", def: "A legislature consisting of two houses (e.g., US Senate and House of Representatives)." },
  { term: "Due Process", def: "Fair treatment through the normal judicial system, guaranteed by the 5th and 14th Amendments." }
];

export default function App() {
  // Navigation & Configuration States
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('normal'); 
  const [simplified, setSimplified] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('liberty_assist_gemini_key') || '');
  const [sbUrl, setSbUrl] = useState(localStorage.getItem('liberty_assist_supabase_url') || '');
  const [sbKey, setSbKey] = useState(localStorage.getItem('liberty_assist_supabase_key') || '');

  // Session & User Profiling
  const [sessionUser, setSessionUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    fullName: 'Guest Citizen',
    role: 'citizen',
    state: 'NY'
  });
  
  // Auth States
  const [authMode, setAuthMode] = useState('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState('citizen');
  const [authState, setAuthState] = useState('NY');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // AI Memory / learnings State
  const [learnings, setLearnings] = useState([]);
  const [newMemoryKey, setNewMemoryKey] = useState('');
  const [newMemoryValue, setNewMemoryValue] = useState('');

  // Consolidated Chat Panels
  const [showChatMemory, setShowChatMemory] = useState(false);
  const [showImagePanel, setShowImagePanel] = useState(false);
  const [showVisionPanel, setShowVisionPanel] = useState(false);

  // Active DB Client Selection
  const db = getSupabaseClient() || mockSupabase;

  // Sync session on mount
  useEffect(() => {
    checkActiveSession();
  }, [sbUrl, sbKey]);

  const checkActiveSession = async () => {
    try {
      const activeClient = getSupabaseClient() || mockSupabase;
      const { data: { user } } = await activeClient.auth.getUser();
      if (user) {
        setSessionUser(user);
        
        const { data: profile } = await activeClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserProfile({
            fullName: profile.full_name,
            role: profile.role,
            state: profile.state
          });
        } else {
          setUserProfile({
            fullName: user.user_metadata?.full_name || 'US User',
            role: user.user_metadata?.role || 'citizen',
            state: user.user_metadata?.state || 'NY'
          });
        }
      } else {
        setSessionUser(null);
      }
    } catch (err) {
      console.error("Error recovering session:", err);
    }
  };

  // Auth Submit Handlers
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const activeClient = getSupabaseClient() || mockSupabase;
      if (authMode === 'signup') {
        const { error } = await activeClient.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: {
              full_name: authName,
              role: authRole,
              state: authState
            }
          }
        });
        
        if (error) throw error;
        alert("Account created successfully!");
        checkActiveSession();
      } else {
        const { error } = await activeClient.auth.signInWithPassword({
          email: authEmail,
          password: authPassword
        });
        
        if (error) throw error;
        checkActiveSession();
      }
    } catch (err) {
      setAuthError(err.message || "An authentication error occurred.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    const activeClient = getSupabaseClient() || mockSupabase;
    await activeClient.auth.signOut();
    setSessionUser(null);
    setUserProfile({ fullName: 'Guest Citizen', role: 'citizen', state: 'NY' });
    setLearnings([]);
    setSavedDocList([]);
    setCurrentTab('dashboard');
  };

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Chatbot State
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Vision / NanoBanan state
  const [visionImage, setVisionImage] = useState(null);
  const [visionLoading, setVisionLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('A seal of the United States for an official Will');
  const [imageGenerating, setImageGenerating] = useState(false);

  // Web Speech recognition hook initialization
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => prev ? prev + ' ' + transcript : transcript);
        setIsListening(false);
      };
      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      };
      rec.onend = () => setIsListening(false);
      
      recognitionRef.current = rec;
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Speech recognition start failed:", e);
      }
    }
  };

  // Text-To-Speech (TTS)
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#`_-]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const usVoice = voices.find(v => v.lang.includes('US') || v.name.includes('Google US') || v.name.includes('Samantha'));
      if (usVoice) utterance.voice = usVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Load chat logs & documents once user signs in
  useEffect(() => {
    if (sessionUser) {
      loadUserData();
      loadLearnings();
    } else {
      setMessages([
        {
          id: 1,
          sender: 'assistant',
          text: "Welcome! Sign in to get legal forms, personalized advice, and save your chat history directly to the Supabase database. Feel free to explore our calculators and checklists anonymously in the meantime!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [sessionUser]);

  const loadUserData = async () => {
    try {
      const activeClient = getSupabaseClient() || mockSupabase;
      
      const { data: chatData, error: chatErr } = await activeClient
        .from('chat_history')
        .select('*')
        .eq('user_id', sessionUser.id)
        .order('created_at', { ascending: true });
      
      if (!chatErr && chatData && chatData.length > 0) {
        setMessages(chatData.map(c => ({
          id: c.id,
          sender: c.sender,
          text: c.message,
          image: c.image || null,
          time: new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      } else {
        setMessages([
          {
            id: 1,
            sender: 'assistant',
            text: `Welcome back, ${userProfile.fullName}! As a designated **${USER_ROLES.find(r => r.value === userProfile.role)?.label}** residing in **${US_STATES.find(s => s.code === userProfile.state)?.name}**, I have custom-tailored your resources and dashboard helpers.\n\nAsk me anything or select a task checklist in the sidebar!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }

      const { data: docs } = await activeClient
        .from('saved_documents')
        .select('*')
        .eq('user_id', sessionUser.id);
      
      if (docs && docs.length > 0) {
        setSavedDocList(docs);
      }
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  };

  // AI Brain & Memory database load
  const loadLearnings = async () => {
    try {
      const activeClient = getSupabaseClient() || mockSupabase;
      const { data, error } = await activeClient
        .from('user_learnings')
        .select('*')
        .eq('user_id', sessionUser.id);
      
      if (!error && data) {
        setLearnings(data);
      }
    } catch (err) {
      console.error("Error loading learnings:", err);
    }
  };

  const handleAddMemory = async (e) => {
    if (e) e.preventDefault();
    if (!newMemoryKey.trim() || !newMemoryValue.trim()) return;

    if (!sessionUser) {
      alert("Sign in to save this memory to your database profile.");
      return;
    }

    try {
      const activeClient = getSupabaseClient() || mockSupabase;
      const { error } = await activeClient
        .from('user_learnings')
        .insert({
          user_id: sessionUser.id,
          learned_key: newMemoryKey.trim(),
          learned_value: newMemoryValue.trim()
        });

      if (error) throw error;
      setNewMemoryKey('');
      setNewMemoryValue('');
      alert("Memory saved!");
      loadLearnings();
    } catch (err) {
      alert("Error saving memory: " + err.message);
    }
  };

  const handleDeleteMemory = async (id) => {
    try {
      const activeClient = getSupabaseClient() || mockSupabase;
      const { error } = await activeClient
        .from('user_learnings')
        .delete()
        .eq('id', id)
        .eq('user_id', sessionUser.id);

      if (error) throw error;
      loadLearnings();
    } catch {
      alert("Failed to delete memory.");
    }
  };

  // Auto learn from messages
  const autoLearnFromText = async (text) => {
    if (!sessionUser) return;
    const patterns = [
      { regex: /my\s+husband\s+is\s+([A-Za-z\s]+)/i, key: 'Husband Name' },
      { regex: /my\s+wife\s+is\s+([A-Za-z\s]+)/i, key: 'Wife Name' },
      { regex: /my\s+business\s+is\s+([A-Za-z0-9\s]+)/i, key: 'Business Name' },
      { regex: /my\s+beneficiary\s+is\s+([A-Za-z\s]+)/i, key: 'Primary Beneficiary' },
      { regex: /i\s+live\s+in\s+([A-Za-z\s]+)/i, key: 'City of Residence' }
    ];

    for (let p of patterns) {
      const match = text.match(p.regex);
      if (match && match[1]) {
        const value = match[1].trim();
        const exists = learnings.find(l => l.learned_key.toLowerCase() === p.key.toLowerCase());
        if (!exists) {
          try {
            const activeClient = getSupabaseClient() || mockSupabase;
            await activeClient.from('user_learnings').insert({
              user_id: sessionUser.id,
              learned_key: p.key,
              learned_value: value
            });
            loadLearnings();
          } catch (e) {
            console.error("Auto-learning failed:", e);
          }
        }
      }
    }
  };

  // Document states
  const [selectedDocType, setSelectedDocType] = useState('will');
  const [docWizardStep, setDocWizardStep] = useState(1);
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [savedDocList, setSavedDocList] = useState([]);
  
  // Document Forms state
  const [willData, setWillData] = useState({ fullName: '', city: '', county: '', spouseName: '', hasChildren: 'no', childrenNames: '', primaryBeneficiary: '', alternateBeneficiary: '', executorName: '', funeralWishes: '' });
  const [leaseData, setLeaseData] = useState({ landlordName: '', tenantName: '', propertyAddress: '', monthlyRent: '', securityDeposit: '', startDate: '', leaseTerm: '12 months', petsAllowed: 'no' });
  const [ndaData, setNdaData] = useState({ disclosingParty: '', receivingParty: '', purpose: '', duration: '2 years', stateJurisdiction: 'NY' });
  const [ceaseData, setCeaseData] = useState({ senderName: '', recipientName: '', reason: 'harassment', details: '', state: 'NY' });

  // Finance states
  const [taxFilingStatus, setTaxFilingStatus] = useState('single');
  const [taxIncome, setTaxIncome] = useState('75000');
  const [taxResult, setTaxResult] = useState(null);

  const [monthlyIncome, setMonthlyIncome] = useState('5000');
  const [rentExpense, setRentExpense] = useState('1500');
  const [foodExpense, setFoodExpense] = useState('500');
  const [utilExpense, setUtilExpense] = useState('400');
  const [otherExpense, setOtherExpense] = useState('900');
  const [budgetReport, setBudgetReport] = useState(null);

  // Student loan planner
  const [studentDebt, setStudentDebt] = useState('30000');
  const [studentInterest, setStudentInterest] = useState('5.5');
  const [studentTerm, setStudentTerm] = useState('10');
  const [studentLoanResult, setStudentLoanResult] = useState(null);

  // Healthcare states
  const [medicalBill, setMedicalBill] = useState('2000');
  const [deductibleRemaining, setDeductibleRemaining] = useState('600');
  const [coInsurance, setCoInsurance] = useState('20');
  const [coPay, setCoPay] = useState('35');
  const [healthcareBreakdown, setHealthcareBreakdown] = useState(null);

  // Naturalization Quiz
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState('');
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Daily Coordinator templates
  const [emailTemplate, setEmailTemplate] = useState('landlord_repair');
  const [emailInputs, setEmailInputs] = useState({ recipient: '', senderName: '', detail1: '', detail2: '' });
  const [draftedEmail, setDraftedEmail] = useState('');

  // Daily Tasks state
  const [tasks, setTasks] = useState([
    { id: 1, text: "Verify U.S. filing deadline for current tax year", completed: false },
    { id: 2, text: "Check passport validation criteria (minimum 6 months validity)", completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  // PWA Study & Study Companion Widgets
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [essayPrompt, setEssayPrompt] = useState('The impact of Federalism in 21st century US governance');
  const [essayOutline, setEssayOutline] = useState('');

  // Professional Work Assistant Widgets
  const [workerBioRole, setWorkerBioRole] = useState('Software Engineer');
  const [workerBioSkills, setWorkerBioSkills] = useState('React, Supabase, Google Cloud APIs');
  const [workerBioTone, setWorkerBioTone] = useState('formal');
  const [generatedWorkerBio, setGeneratedWorkerBio] = useState('');
  const [workerShiftStart, setWorkerShiftStart] = useState('09:00');
  const [workerShiftEnd, setWorkerShiftEnd] = useState('17:00');
  const [workerMeetingsCount, setWorkerMeetingsCount] = useState(2);
  const [workerShiftSchedule, setWorkerShiftSchedule] = useState('');
  const [contractorMiles, setContractorMiles] = useState('50');
  const [contractorDeduction, setContractorDeduction] = useState(null);

  // Google Calendar Integration helper
  const getGoogleCalendarLink = (title, startDate, details) => {
    const formattedTitle = encodeURIComponent(title);
    const formattedDetails = encodeURIComponent(details);
    
    let dateStr = "";
    try {
      const d = new Date(startDate);
      if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        dateStr = `${yyyy}${mm}${dd}/${yyyy}${mm}${dd}`;
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        dateStr = `${yyyy}${mm}${dd}/${yyyy}${mm}${dd}`;
      }
    } catch {
      dateStr = "TEMPLATE";
    }
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${formattedTitle}&dates=${dateStr}&details=${formattedDetails}`;
  };

  // Pomodoro countdown timer logic
  useEffect(() => {
    let interval = null;
    if (pomodoroActive) {
      interval = setInterval(() => {
        if (pomodoroSeconds > 0) {
          setPomodoroSeconds(pomodoroSeconds - 1);
        } else if (pomodoroMinutes > 0) {
          setPomodoroMinutes(pomodoroMinutes - 1);
          setPomodoroSeconds(59);
        } else {
          setPomodoroActive(false);
          if (speechEnabled) speakText("Study timer ended. Take a 5 minute break!");
          alert("Pomodoro session completed! Take a break.");
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [pomodoroActive, pomodoroMinutes, pomodoroSeconds]);

  // Clean Markdown & Bold/Italic formatting parser
  const parseInlineMarkdown = (text) => {
    if (!text) return '';
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`b-${index}`}>{part.slice(2, -2)}</strong>;
      }
      
      const italicParts = part.split(/(\*.*?\*)/g);
      return italicParts.map((subpart, subindex) => {
        if (subpart.startsWith('*') && subpart.endsWith('*')) {
          return <em key={`i-${subindex}`}>{subpart.slice(1, -1)}</em>;
        }
        return subpart;
      });
    });
  };

  const renderFormattedText = (text) => {
    if (!text) return '';
    const lines = text.split('\n');
    
    return lines.map((line, idx) => {
      // List parsing
      const listMatch = line.match(/^(\s*)[*-]\s+(.*)$/);
      if (listMatch) {
        return (
          <li key={idx} style={{ marginLeft: '1.5rem', marginBottom: '0.35rem', listStyleType: 'disc' }}>
            {parseInlineMarkdown(listMatch[2])}
          </li>
        );
      }
      
      // Header parsing
      const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const headingText = headerMatch[2];
        if (level === 1) return <h1 key={idx} style={{ fontSize: '1.55rem', marginTop: '1.15rem', marginBottom: '0.45rem', color: 'var(--color-blue)' }}>{parseInlineMarkdown(headingText)}</h1>;
        if (level === 2) return <h2 key={idx} style={{ fontSize: '1.25rem', marginTop: '0.9rem', marginBottom: '0.35rem', color: 'var(--color-blue)' }}>{parseInlineMarkdown(headingText)}</h2>;
        return <h3 key={idx} style={{ fontSize: '1.1rem', marginTop: '0.7rem', marginBottom: '0.2' }}>{parseInlineMarkdown(headingText)}</h3>;
      }
      
      if (!line.trim()) return <div key={idx} style={{ height: '0.4rem' }} />;
      
      return (
        <p key={idx} style={{ margin: '0 0 0.4rem 0' }}>
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Image Upload Vision handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setVisionImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Inline Vision OCR
  const runVisionOCR = async () => {
    if (!visionImage) return;
    setVisionLoading(true);
    setVisionOutput('');

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: "Scanned document using Vision OCR.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    if (geminiKey) {
      try {
        const base64Data = visionImage.split(',')[1];
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: "OCR Reader: Read all text in this image, identify if it is a medical invoice, utility bill, or passport. Output the extracted names, dates, billing totals, or passport numbers in clear bullet points." },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Data
                  }
                }
              ]
            }]
          })
        });
        const data = await res.json();
        if (data.candidates && data.candidates[0].content.parts[0].text) {
          const textRes = data.candidates[0].content.parts[0].text;
          addVisionResultToChat(textRes);
        } else {
          addVisionResultToChat("Failed to scan document with Gemini Vision.");
        }
      } catch {
        addVisionResultToChat("Failed to call Vision API. Fallback to local OCR simulation.");
      } finally {
        setVisionLoading(false);
        setShowVisionPanel(false);
        setVisionImage(null);
      }
    } else {
      setTimeout(() => {
        const mockOCRResult = `### 👁️ Scanned Document Extracted Records
*   **Document Type:** Medical Invoice
*   **Patient name:** ${userProfile.fullName}
*   **US State:** ${userProfile.state}
*   **Invoice Billing Amount:** $1,450.00
*   **Remaining Deductible Applied:** $600.00
*   **Statement Date:** ${new Date().toLocaleDateString()}

*Successfully extracted! Ask me questions about this invoice.*`;
        addVisionResultToChat(mockOCRResult);
        setVisionLoading(false);
        setShowVisionPanel(false);
        setVisionImage(null);
      }, 1500);
    }
  };

  const addVisionResultToChat = async (ocrText) => {
    const assistantMsg = {
      id: Date.now() + 1,
      sender: 'assistant',
      text: ocrText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, assistantMsg]);
    if (speechEnabled) speakText("Document details loaded into the chat conversation.");

    if (sessionUser) {
      try {
        await db.from('chat_history').insert({
          user_id: sessionUser.id,
          sender: 'assistant',
          message: ocrText
        });
      } catch (e) {
        console.error("Could not save vision result:", e);
      }
    }
  };

  // Inline NanoBanan Image generator
  const runImageGenerator = async () => {
    if (!imagePrompt.trim()) return;
    setImageGenerating(true);

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: `Generate NanoBanan patriotic seal: "${imagePrompt}"`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(async () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 400, 400);

      ctx.strokeStyle = '#D4AF37'; 
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(200, 200, 160, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.fillStyle = '#1565C0'; 
      ctx.beginPath();
      ctx.arc(200, 200, 140, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#D32F2F'; 
      ctx.beginPath();
      ctx.arc(200, 200, 80, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '72px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('★', 200, 195);

      ctx.fillStyle = '#D4AF37';
      ctx.font = '14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('LIBERTYASSIST OFFICIAL EMBLEM', 200, 310);
      ctx.fillText(userProfile.state.toUpperCase() + ' STATE JURISDICTION', 200, 95);

      const dataUrl = canvas.toDataURL();
      
      const assistantMsg = {
        id: Date.now() + 2,
        sender: 'assistant',
        text: `### Custom Graphic Created\nI have rendered your custom US patriotic seal based on your prompt: "${imagePrompt}". You can view and download the PNG below.`,
        image: dataUrl,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
      setImageGenerating(false);
      setShowImagePanel(false);
      
      if (speechEnabled) speakText("Graphic seal generated successfully.");

      if (sessionUser) {
        try {
          await db.from('chat_history').insert({
            user_id: sessionUser.id,
            sender: 'assistant',
            message: assistantMsg.text,
            image: dataUrl
          });
        } catch (e) {
          console.error("Could not save image message:", e);
        }
      }
    }, 1800);
  };

  // Simulated responder logic with learning memory
  const getRoleTailoredResponse = (query) => {
    const q = query.toLowerCase();
    const role = userProfile.role;
    let memoryContext = "";
    if (learnings.length > 0) {
      memoryContext = "### 🧠 Active Memory Recall\n";
      learnings.forEach(l => {
        memoryContext += `*   **${l.learned_key}:** ${l.learned_value}\n`;
      });
      memoryContext += "\n";
    }

    let disclaimer = `**Disclaimer:** *LibertyAssist provides information, not formal representation. As a registered **${USER_ROLES.find(r => r.value === role)?.label}**, this guidance is tuned to your profile.* \n\n`;

    if (role === 'lawyer') {
      if (q.includes('ethics') || q.includes('aba') || q.includes('rule')) {
        return memoryContext + disclaimer + `### ABA Model Rules of Professional Conduct Reference\n` +
          `*   **Rule 1.1 (Competence):** A lawyer shall provide competent representation.\n` +
          `*   **Rule 1.6 (Confidentiality):** A lawyer shall not reveal information relating to representation.\n` +
          `*   **Rule 1.7 (Conflict of Interest):** Guidelines regarding concurrent conflict of interests.\n\n` +
          `Check your state's Ethics board for state-specific adoptions.`;
      }
    }

    if (role === 'doctor') {
      if (q.includes('hipaa') || q.includes('privacy') || q.includes('patient')) {
        return memoryContext + disclaimer + `### HIPAA Privacy Rule Guidelines\n` +
          `*   **Protected Health Information (PHI):** Under federal law, PHI covers medical records, billing records, and personal demographics.\n` +
          `*   **Minimum Necessary Standard:** Limit PHI disclosures to the minimum necessary.`;
      }
    }

    if (role === 'student') {
      if (q.includes('study') || q.includes('essay') || q.includes('exam')) {
        return memoryContext + disclaimer + `### Study & Academic Outline Helper\n` +
          `Use the **Academic Study Desk** inside your Student Dashboard to generate structured essay outlines, practice SAT flashcards, and run Pomodoro study timers to stay focused!`;
      }
    }

    if (q.includes('will') || q.includes('estate')) {
      return memoryContext + disclaimer + `### Standard US Last Will Guidelines\n` +
        `A standard Will requires two witnesses and must be executed in writing.\n` +
        `Use the **Document Drafter** tab to generate a custom draft.`;
    }

    return memoryContext + disclaimer + `I received your request: "${query}". You can browse the specialized checklists, document templates, and calculators corresponding to your role (**${USER_ROLES.find(r => r.value === role)?.label}**) using the left sidebar menu.`;
  };

  // Chat message submit
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    if (speechEnabled) stopSpeaking();

    autoLearnFromText(userText);

    if (sessionUser) {
      try {
        await db.from('chat_history').insert({
          user_id: sessionUser.id,
          sender: 'user',
          message: userText
        });
      } catch (err) {
        console.error("Could not write user message to Supabase:", err);
      }
    }

    setTimeout(async () => {
      let responseText = "";
      
      let learningsContext = "";
      if (learnings.length > 0) {
        learningsContext = "Learned facts about user that you must remember: " + 
          learnings.map(l => `${l.learned_key}=${l.learned_value}`).join(', ') + ". ";
      }

      if (geminiKey) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are LibertyAssist, a highly accessible US legal, financial, and personal coordinator. ${learningsContext} Tailor your answer to a user who is registered as a ${userProfile.role} in the state of ${userProfile.state}. Current prompt: ${userText}`
                }]
              }]
            })
          });
          const data = await res.json();
          if (data.candidates && data.candidates[0].content.parts[0].text) {
            responseText = data.candidates[0].content.parts[0].text;
          } else {
            responseText = getRoleTailoredResponse(userText);
          }
        } catch {
          responseText = "Failed to query Gemini 2.5 Flash. Switched to local mode:\n\n" + getRoleTailoredResponse(userText);
        }
      } else {
        responseText = getRoleTailoredResponse(userText);
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);

      if (sessionUser) {
        try {
          await db.from('chat_history').insert({
            user_id: sessionUser.id,
            sender: 'assistant',
            message: responseText
          });
        } catch (err) {
          console.error("Could not save assistant message to Supabase:", err);
        }
      }

      if (speechEnabled) speakText(responseText);
    }, 1000);
  };

  // Save generated document
  const saveGeneratedDocument = async () => {
    if (!sessionUser) {
      alert("Please sign in to save documents to the database.");
      return;
    }

    try {
      const { error } = await db.from('saved_documents').insert({
        user_id: sessionUser.id,
        doc_type: selectedDocType,
        doc_content: generatedDoc
      });

      if (error) throw error;
      alert("Document saved successfully to your cloud locker!");
      loadUserData();
    } catch (err) {
      alert("Failed to save document: " + err.message);
    }
  };

  const deleteSavedDocument = async (id) => {
    try {
      const { error } = await db
        .from('saved_documents')
        .delete()
        .eq('id', id)
        .eq('user_id', sessionUser.id);
      
      if (error) throw error;
      alert("Document deleted.");
      loadUserData();
    } catch {
      alert("Failed to delete document.");
    }
  };

  // Document templates
  const generateLegalDocument = () => {
    let text = "";

    if (selectedDocType === 'will') {
      text = `LAST WILL AND TESTAMENT\nOF\n${willData.fullName.toUpperCase() || "[FULL NAME]"}\n\nI, ${willData.fullName || "[Full Name]"}, residing in the City of ${willData.city || "[City]"}, County of ${willData.county || "[County]"}, State of ${stateName}, being of sound mind and memory, do hereby declare this to be my Last Will and Testament, revoking prior wills.\n\nFAMILY DECLARATIONS:\n${willData.spouseName ? `I am married to ${willData.spouseName}.` : "I am unmarried."} ${willData.hasChildren === 'yes' ? `My children are: ${willData.childrenNames}.` : "I have no children."}\n\nDISPOSITION OF ASSETS:\nI bequeath all my real and personal estate to my Primary Beneficiary: ${willData.primaryBeneficiary || "[Primary Beneficiary]"}. In the event that they do not survive me, my estate shall go to my Alternate Beneficiary: ${willData.alternateBeneficiary || "[Alternate Beneficiary]"}.\n\nEXECUTORSHIP:\nI nominate ${willData.executorName || "[Executor]"} as Executor of this will without bond requirements.\n\nSPECIAL DIRECTIVES:\n${willData.funeralWishes || "No special requests."}\n\nSigned on this _____ day of ________________, 20____.\n\n___________________________________\n${willData.fullName || "[Testator Signature]"}\n\nWitness 1: __________________  Address: __________________\nWitness 2: __________________  Address: __________________\n`;
    } 
    else if (selectedDocType === 'lease') {
      text = `RESIDENTIAL LEASE AGREEMENT\n\nLANDLORD: ${leaseData.landlordName || "[Landlord]"}\nTENANT: ${leaseData.tenantName || "[Tenant]"}\n\nPROPERTY: ${leaseData.propertyAddress || "[Address]"}\n\nTERM: The term begins on ${leaseData.startDate || "[Start Date]"} and runs for ${leaseData.leaseTerm}.\n\nPAYMENTS: Tenant shall pay monthly rent of $${leaseData.monthlyRent} on or before the 1st of each month. A security deposit of $${leaseData.securityDeposit} is due upon signing.\n\nRULES: Pets are ${leaseData.petsAllowed === 'yes' ? 'ALLOWED' : 'NOT ALLOWED'}.\n\nGOVERNING LAW: Governed by the laws of ${stateName}.\n\nLandlord: ________________________  Date: ____________\nTenant: ________________________  Date: ____________\n`;
    }
    else if (selectedDocType === 'nda') {
      text = `MUTUAL NON-DISCLOSURE AGREEMENT\n\nDISCLOSER: ${ndaData.disclosingParty || "[Discloser]"}\nRECIPIENT: ${ndaData.receivingParty || "[Recipient]"}\n\nPURPOSE: ${ndaData.purpose || "[Purpose]"}\n\nTERMS: Confidential information shared between parties shall remain private for a period of ${ndaData.duration}.\n\nGOVERNING LAW: Governed by the laws of the State of ${ndaData.stateJurisdiction}.\n\nDiscloser: ________________________  Date: ____________\nRecipient: ________________________  Date: ____________\n`;
    }
    else if (selectedDocType === 'cease') {
      text = `FORMAL CEASE AND DESIST ORDER\n\nTO: ${ceaseData.recipientName || "[Recipient Name]"}\nFROM: ${ceaseData.senderName || "[Sender Name]"}\n\nNOTICE IS HEREBY GIVEN that your activities, specifically: "${ceaseData.details || "[Specify Harassment details]"}", constitute illegal ${ceaseData.reason} under the laws of ${stateName}.\n\nYou are hereby directed to CEASE AND DESIST all further contact, harassment, or defamatory remarks immediately. Failure to comply will result in immediate legal actions, including injunctions or civil lawsuits without further notice.\n\nSigned this _____ day of ________________, 20____.\n\n___________________________________\n${ceaseData.senderName || "[Sender Signature]"}\n`;
    }

    setGeneratedDoc(text);
    setDocWizardStep(4);
    if (speechEnabled) speakText("Document generated. Review details below.");
  };

  // Tax calculations
  const calculateTaxes = () => {
    const income = parseFloat(taxIncome) || 0;
    const deduction = taxFilingStatus === 'single' ? 15000 : taxFilingStatus === 'joint' ? 30000 : 22500;
    const taxable = Math.max(0, income - deduction);
    let tax = 0;
    if (taxable > 0) {
      tax += Math.min(taxable, 11600) * 0.10;
      if (taxable > 11600) {
        tax += Math.min(taxable - 11600, 35550) * 0.12;
        if (taxable > 47150) {
          tax += (taxable - 47150) * 0.22;
        }
      }
    }
    setTaxResult({
      gross: income,
      deduction,
      taxable,
      tax: tax.toFixed(2),
      takehome: (income - tax).toFixed(2),
      rate: income > 0 ? ((tax / income) * 100).toFixed(1) : 0
    });
  };

  const calculateBudget = () => {
    const income = parseFloat(monthlyIncome) || 0;
    const rent = parseFloat(rentExpense) || 0;
    const food = parseFloat(foodExpense) || 0;
    const utils = parseFloat(utilExpense) || 0;
    const other = parseFloat(otherExpense) || 0;
    const spent = rent + food + utils + other;
    setBudgetReport({
      spent,
      savings: Math.max(0, income - spent),
      needs: rent + food + utils,
      wants: other,
      needsPct: income > 0 ? (((rent + food + utils) / income) * 100).toFixed(0) : 0,
      wantsPct: income > 0 ? ((other / income) * 100).toFixed(0) : 0,
      savingsPct: income > 0 ? (((income - spent) / income) * 100).toFixed(0) : 0
    });
  };

  const calculateStudentLoans = () => {
    const principal = parseFloat(studentDebt) || 0;
    const rate = parseFloat(studentInterest) / 100 / 12 || 0;
    const months = parseFloat(studentTerm) * 12 || 120;
    let payment = 0;
    if (rate > 0) {
      payment = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    } else {
      payment = principal / months;
    }
    const totalPaid = payment * months;
    setStudentLoanResult({
      monthly: payment.toFixed(2),
      total: totalPaid.toFixed(2),
      interest: (totalPaid - principal).toFixed(2)
    });
  };

  const calculateHealthcareCost = () => {
    const bill = parseFloat(medicalBill) || 0;
    const dedRem = parseFloat(deductibleRemaining) || 0;
    const cop = parseFloat(coPay) || 0;

    let patient = cop;
    let remaining = Math.max(0, bill - cop);

    const dedPaid = Math.min(remaining, dedRem);
    patient += dedPaid;
    remaining = Math.max(0, remaining - dedPaid);

    const coinsPaid = remaining * (parseFloat(coInsurance) / 100);
    patient += coinsPaid;

    setHealthcareBreakdown({
      patientTotal: patient.toFixed(2),
      insuranceTotal: (bill - patient).toFixed(2),
      breakdown: `Copay: $${cop} | Deductible Met: $${dedPaid} | Co-insurance Share: $${coinsPaid.toFixed(2)}`
    });
  };



  // Academic outline builder
  const generateEssayOutline = () => {
    setEssayOutline(`### 📝 Academic Essay Outline Plan
*   **Working Title:** "${essayPrompt}"
*   **Introduction:**
    *   *Hook:* Contrast historical US federalist debates (Federalist vs Anti-Federalist Papers) with modern local-federal tensions.
    *   *Thesis Statement:* While cooperative federalism promotes local policy testing, it exacerbates regulatory friction in state-specific jurisdictions.
*   **Body Paragraph 1: Fiscal Federalism**
    *   Topic Sentence: Federal grants-in-aid direct state budgets under federal mandates.
    *   Evidence: Conditional funding in highway and education programs.
*   **Body Paragraph 2: Judicial Precedents & Jurisdictions**
    *   Topic Sentence: Supreme Court interpretations of the Commerce Clause shape state bounds.
*   **Conclusion:**
    *   Restated Thesis & summary of federalist friction points.`);
    if (speechEnabled) speakText("Essay outline drafted.");
  };

  // Worker Bio generator
  const generateWorkerProfile = () => {
    const intro = workerBioTone === 'formal' ? "Results-driven US professional" : "Passionate creator and problem-solver";
    setGeneratedWorkerBio(`"${intro} specialized in ${workerBioRole}. Experienced in leveraging ${workerBioSkills} to optimize operational workflow and scale robust, state-compliant technical solutions in the United States."`);
  };

  // Worker Shift schedule
  const generateWorkShiftSchedule = () => {
    setWorkerShiftSchedule(`### 📅 Daily Professional Shift Itinerary
*   **${workerShiftStart} - Work Day Begins:** Set priorities and review core action items.
*   **10:30 - Collaboration Session:** Align goals and review outstanding client communications.
*   **13:00 - Focus Block:** Primary engineering and project development (no meetings).
*   **15:00 - Status Meeting:** Align deliverables with supervisor.
*   **${workerShiftEnd} - Work Day Ends:** Log timesheets and review tomorrow's tasks.`);
  };

  // Gig mileage deductions
  const calculateGigDeductions = () => {
    const miles = parseFloat(contractorMiles) || 0;
    // 2026 Standard IRS Mileage Rate (Estimated around $0.685/mile)
    const irsRate = 0.685;
    const deduction = miles * irsRate;
    setContractorDeduction(deduction.toFixed(2));
  };

  // Daily Tasks Checklist
  const handleAddTask = (e) => {
    if (e) e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTaskText, completed: false }]);
    setNewTaskText('');
  };

  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  // Email template drafts
  const generateEmailDraft = () => {
    let emailText = "";
    if (emailTemplate === 'landlord_repair') {
      emailText = `Subject: Urgent Maintenance Request - Apt ${emailInputs.detail2 || "[Apt]"}\n\nDear Landlord,\n\nI am writing to notify you of a repair issue at my residence:\n${emailInputs.detail1 || "[Describe issue, e.g., water leak]"}.\n\nThis is causing significant inconvenience. I am available to grant entry at the following times: ${emailInputs.detail2 || "[Availability]"}.\n\nBest,\n${emailInputs.senderName || "[Your Name]"}`;
    } else if (emailTemplate === 'time_off') {
      emailText = `Subject: Time Off Request - ${emailInputs.senderName || "[Your Name]"}\n\nDear Supervisor,\n\nI would like to request leave starting on ${emailInputs.detail1 || "[Start Date]"} and returning on ${emailInputs.detail2 || "[End Date]"}.\n\nI will make sure my duties are delegated. Thank you for your support.\n\nSincerely,\n${emailInputs.senderName || "[Your Name]"}`;
    } else {
      emailText = `Subject: School Excuse Note for ${emailInputs.detail1 || "[Child Name]"}\n\nDear Principal,\n\nPlease excuse ${emailInputs.detail1 || "[Child Name]"} for their absence on ${emailInputs.detail2 || "[Date]"}. They were away due to medical reasons.\n\nThank you,\n${emailInputs.senderName || "[Parent Name]"}`;
    }
    setDraftedEmail(emailText);
  };

  useEffect(() => {
    calculateTaxes();
    calculateBudget();
    calculateStudentLoans();
    calculateHealthcareCost();
    generateEmailDraft();
    generateEssayOutline();
    generateWorkerProfile();
    generateWorkShiftSchedule();
    calculateGigDeductions();
  }, [userProfile.role]);

  return (
    <div className={`app-container ${fontSize === 'large' ? 'font-scale-lg' : fontSize === 'xl' ? 'font-scale-xl' : ''}`}>
      
      {/* HEADER BAR */}
      <header className="app-header">
        <a href="#" className="logo-container" onClick={() => setCurrentTab('dashboard')}>
          <div className="logo-icon">LA</div>
          <div className="logo-text">
            <h1 id="brand-title">LibertyAssist <span className="logo-badge">US</span></h1>
          </div>
        </a>

        {sessionUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--bg-secondary)', padding: '0.4rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
            <UserCheck size={16} style={{ color: 'var(--color-blue)' }} />
            <span>Hello, <strong>{userProfile.fullName}</strong> ({USER_ROLES.find(r => r.value === userProfile.role)?.label})</span>
            <button className="msg-action-btn" title="Sign Out" onClick={handleSignOut} style={{ color: 'var(--color-red)' }}>
              <LogOut size={16} />
            </button>
          </div>
        )}

        <div className="nav-controls">
          <button id="btn-nav-chat" className={`control-btn ${currentTab === 'chat' ? 'active' : ''}`} onClick={() => { setCurrentTab('chat'); stopSpeaking(); }}>
            <Sparkles size={18} />
            <span>Chat AI</span>
          </button>
          
          <button id="btn-nav-docs" className={`control-btn ${currentTab === 'legal' ? 'active' : ''}`} onClick={() => { setCurrentTab('legal'); stopSpeaking(); }}>
            <Scale size={18} />
            <span>Draft Docs</span>
          </button>

          <button id="btn-theme-toggle" className="control-btn accent-red" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </header>

      {/* ACCESSIBILITY BAR */}
      <div className="accessibility-bar" id="accessibility-toolbar">
        <div className="acc-group">
          <Type size={16} />
          <span className="acc-label">Size:</span>
          <div className="acc-pill-group">
            <button className={`acc-pill-btn ${fontSize === 'normal' ? 'active' : ''}`} onClick={() => setFontSize('normal')}>A</button>
            <button className={`acc-pill-btn ${fontSize === 'large' ? 'active' : ''}`} onClick={() => setFontSize('large')}>A+</button>
            <button className={`acc-pill-btn ${fontSize === 'xl' ? 'active' : ''}`} onClick={() => setFontSize('xl')}>A++</button>
          </div>
        </div>

        <div className="acc-group">
          <HelpCircle size={16} />
          <span className="acc-label">Jargon:</span>
          <div className="acc-pill-group">
            <button className={`acc-pill-btn ${!simplified ? 'active' : ''}`} onClick={() => setSimplified(false)}>Standard</button>
            <button className={`acc-pill-btn ${simplified ? 'active red' : ''}`} onClick={() => setSimplified(true)}>Simplified</button>
          </div>
        </div>

        <div className="acc-group">
          <span className="acc-label">Voice:</span>
          <div className="acc-pill-group">
            <button className={`acc-pill-btn ${!speechEnabled ? 'active' : ''}`} onClick={() => { setSpeechEnabled(false); stopSpeaking(); }}>Off</button>
            <button className={`acc-pill-btn ${speechEnabled ? 'active red' : ''}`} onClick={() => { setSpeechEnabled(true); speakText("Readout enabled."); }}>On</button>
          </div>
        </div>

        <div className="acc-group">
          <span className="acc-label">State:</span>
          <select 
            id="state-selector"
            className="form-select" 
            style={{ padding: '0.15rem 0.5rem', fontSize: '0.85rem' }} 
            value={userProfile.state} 
            onChange={(e) => {
              setUserProfile({...userProfile, state: e.target.value});
              if (speechEnabled) speakText(`State set to ${e.target.value}`);
            }}
          >
            {US_STATES.map(s => <option key={s.code} value={s.code}>{s.code} - {s.name}</option>)}
          </select>
        </div>
      </div>

      {/* WORKSPACE LAYOUT */}
      <div className="main-layout">
        
        {/* Navigation Sidebar */}
        <aside className="sidebar">
          <span className="sidebar-heading">Navigation</span>
          
          <button id="side-tab-dashboard" className={`category-btn ${currentTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setCurrentTab('dashboard'); stopSpeaking(); }}>
            <span className="category-icon">🏛️</span>
            <span>Welcome Desk</span>
          </button>

          <button id="side-tab-chat" className={`category-btn ${currentTab === 'chat' ? 'active' : ''}`} onClick={() => { setCurrentTab('chat'); stopSpeaking(); }}>
            <span className="category-icon">💬</span>
            <span>AI Legal & Life Chat</span>
          </button>

          <button id="side-tab-legal" className={`category-btn ${currentTab === 'legal' ? 'active' : ''}`} onClick={() => { setCurrentTab('legal'); stopSpeaking(); }}>
            <span className="category-icon">📄</span>
            <span>US Document Drafter</span>
          </button>

          {/* Student Study tab shows up for student role */}
          {userProfile.role === 'student' && (
            <button id="side-tab-study" className={`category-btn ${currentTab === 'study' ? 'active' : ''}`} onClick={() => { setCurrentTab('study'); stopSpeaking(); }}>
              <span className="category-icon">🎓</span>
              <span>Academic Study Desk</span>
            </button>
          )}

          {/* Professional Work assistant tab */}
          <button id="side-tab-worker" className={`category-btn ${currentTab === 'worker' ? 'active' : ''}`} onClick={() => { setCurrentTab('worker'); stopSpeaking(); }}>
            <span className="category-icon">💼</span>
            <span>Work Assistant Desk</span>
          </button>

          <button id="side-tab-finance" className={`category-btn ${currentTab === 'finance' ? 'active' : ''}`} onClick={() => { setCurrentTab('finance'); stopSpeaking(); }}>
            <span className="category-icon">💵</span>
            <span>Personal Finance Hub</span>
          </button>

          <button id="side-tab-civic" className={`category-btn ${currentTab === 'civic' ? 'active' : ''}`} onClick={() => { setCurrentTab('civic'); stopSpeaking(); }}>
            <span className="category-icon">🗳️</span>
            <span>Civic Helpers</span>
          </button>

          <button id="side-tab-healthcare" className={`category-btn ${currentTab === 'healthcare' ? 'active' : ''}`} onClick={() => { setCurrentTab('healthcare'); stopSpeaking(); }}>
            <span className="category-icon">🏥</span>
            <span>Healthcare Jargon</span>
          </button>

          <button id="side-tab-coordinator" className={`category-btn ${currentTab === 'coordinator' ? 'active' : ''}`} onClick={() => { setCurrentTab('coordinator'); stopSpeaking(); }}>
            <span className="category-icon">📅</span>
            <span>Personal Coordinator</span>
          </button>

          {!sessionUser && (
            <button id="side-tab-auth" className={`category-btn ${currentTab === 'auth' ? 'active' : ''}`} onClick={() => { setCurrentTab('auth'); stopSpeaking(); }} style={{ marginTop: 'auto', border: '1px dashed var(--color-red)', color: 'var(--color-red)' }}>
              <span className="category-icon">🔒</span>
              <span>Sign In / Connect DB</span>
            </button>
          )}

          <button id="side-tab-settings" className={`category-btn ${currentTab === 'settings' ? 'active' : ''}`} onClick={() => { setCurrentTab('settings'); stopSpeaking(); }} style={{ marginTop: !sessionUser ? '0' : 'auto' }}>
            <span className="category-icon">⚙️</span>
            <span>AI & DB Connections</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="content-area">
          
          {/* TAB: AUTHENTICATION */}
          {currentTab === 'auth' && (
            <div className="module-body animate-slide-up" style={{ alignSelf: 'center', margin: 'auto' }}>
              <div className="step-wizard" style={{ width: '420px', maxWidth: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <Lock size={42} style={{ color: 'var(--color-blue)', margin: '0 auto 0.5rem auto' }} />
                  <h2>LibertyAssist Secure Lockbox</h2>
                  <p>Save documents, profiles, and chats directly to your cloud Supabase database.</p>
                </div>

                {authError && (
                  <div className="doc-disclaimer" style={{ marginBottom: '1rem' }}>
                    <AlertTriangle size={16} style={{ display: 'inline', marginRight: '4px' }} />
                    {authError}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {authMode === 'signup' && (
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" required className="form-input" placeholder="e.g. Dr. Arthur Miller" value={authName} onChange={(e) => setAuthName(e.target.value)} />
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" required className="form-input" placeholder="name@domain.com" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" required className="form-input" placeholder="••••••••" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />
                  </div>

                  {authMode === 'signup' && (
                    <div className="calc-grid">
                      <div className="form-group">
                        <label className="form-label">USA Profile Role / Persona</label>
                        <select className="form-select" value={authRole} onChange={(e) => setAuthRole(e.target.value)}>
                          {USER_ROLES.map(role => <option key={role.value} value={role.value}>{role.label}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Home US State</label>
                        <select className="form-select" value={authState} onChange={(e) => setAuthState(e.target.value)}>
                          {US_STATES.map(st => <option key={st.code} value={st.code}>{st.code} - {st.name}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    {authLoading ? "Processing..." : authMode === 'signup' ? "Create Account & Sign In" : "Sign In"}
                  </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem' }}>
                  {authMode === 'signin' ? (
                    <span>Don't have an account? <a href="#" style={{ color: 'var(--color-blue)', fontWeight: 'bold' }} onClick={() => setAuthMode('signup')}>Sign Up</a></span>
                  ) : (
                    <span>Already have an account? <a href="#" style={{ color: 'var(--color-blue)', fontWeight: 'bold' }} onClick={() => setAuthMode('signin')}>Sign In</a></span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: WELCOME DASHBOARD */}
          {currentTab === 'dashboard' && (
            <div className="animate-slide-up">
              <div className="module-header">
                <span className="module-badge">US Persona Workspace</span>
                <h2>{USER_ROLES.find(r => r.value === userProfile.role)?.label} Dashboard</h2>
                <p className="module-description">
                  Authentic, legal, and lifestyle assistance configured specifically for your profile in the state of <strong>{US_STATES.find(s => s.code === userProfile.state)?.name}</strong>.
                </p>
              </div>

              <div style={{ padding: '0 2rem' }}>

                {/* 💼 LAWYER DASHBOARD */}
                {userProfile.role === 'lawyer' && (
                  <div className="tool-container" style={{ marginTop: '1.5rem', borderLeft: '6px solid var(--color-blue)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <Award size={20} style={{ color: 'var(--color-blue)' }} />
                      <h3>US Attorney & Bar Resource Portal</h3>
                    </div>
                    <p>Compliance resources and client assistants for attorney members in {userProfile.state}.</p>
                    
                    <div className="calc-grid" style={{ marginTop: '1rem' }}>
                      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <strong>📚 Continuing Legal Education (CLE)</strong>
                        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0, fontSize: '0.9rem' }}>
                          <li>{userProfile.state} state requirements: typically 24-36 credits every 2 years.</li>
                          <li>Ethics credits required: minimum 4 credits.</li>
                          <li><a href="https://www.americanbar.org" target="_blank" style={{ color: 'var(--color-blue)' }}>Visit ABA CLE Catalog</a></li>
                        </ul>
                      </div>
                      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <strong>⚖️ Professional Ethics Board Contacts</strong>
                        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0, fontSize: '0.9rem' }}>
                          <li>Submit ethics inquiries to the {userProfile.state} Bar Association.</li>
                          <li>Refer to ABA Model Rules 1.6 (confidentiality) and 1.7 (conflicts).</li>
                          <li>Find local federal court filings via PACER.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🩺 DOCTOR DASHBOARD */}
                {userProfile.role === 'doctor' && (
                  <div className="tool-container" style={{ marginTop: '1.5rem', borderLeft: '6px solid var(--color-blue)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <HeartPulse size={20} style={{ color: 'var(--color-blue)' }} />
                      <h3>Medical Professional Compliance Portal</h3>
                    </div>
                    <p>DEA credentials, HIPAA checklists, and licensing board details for medical professionals in {userProfile.state}.</p>

                    <div className="calc-grid" style={{ marginTop: '1rem' }}>
                      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <strong>🔒 HIPAA Patient Privacy Audit Checklist</strong>
                        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0, fontSize: '0.9rem' }}>
                          <li>Are computer screens displaying PHI facing away from visitors?</li>
                          <li>Is encrypted email (SSL/TLS) active for external reports?</li>
                          <li>Have all patient intake forms had explicit privacy agreements signed?</li>
                        </ul>
                      </div>
                      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <strong>🏥 DEA & State Medical Licensing</strong>
                        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0, fontSize: '0.9rem' }}>
                          <li>Submit renewals to the state Board of Medicine for {userProfile.state}.</li>
                          <li>Verify active NPI status via the CMS registry.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🕊️ REFUGEE DASHBOARD */}
                {userProfile.role === 'refugee' && (
                  <div className="tool-container" style={{ marginTop: '1.5rem', borderLeft: '6px solid var(--color-red)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <Globe size={20} style={{ color: 'var(--color-red)' }} />
                      <h3>Humanitarian & Refugee Guidance Center</h3>
                    </div>
                    <p>Casework tools, travel papers, and work authorization trackers for refugees in the US.</p>

                    <div className="calc-grid" style={{ marginTop: '1rem' }}>
                      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <strong>🗓️ Refugee First-Year Integration Milestones</strong>
                        <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div>🟢 <strong>Month 1:</strong> Apply for Social Security card & SNAP/Medicaid benefits.</div>
                          <div>🟡 <strong>Month 6:</strong> Confirm work authorization card (EAD) delivery.</div>
                          <div>🔴 <strong>Year 1:</strong> Apply for Green Card (Form I-485 Adjustment of Status).</div>
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <strong>🤝 Legal Aid & Free Resettlement Services</strong>
                        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0, fontSize: '0.9rem' }}>
                          <li>Find local legal aid offices via LawHelp.org.</li>
                          <li>Reach out to the Office of Refugee Resettlement (ORR) in {userProfile.state}.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🗺️ IMMIGRANT DASHBOARD (VISAS & CIVICS QUIZ) */}
                {userProfile.role === 'immigrant' && (
                  <div className="tool-container" style={{ marginTop: '1.5rem', borderLeft: '6px solid var(--color-red)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <FileCheck size={20} style={{ color: 'var(--color-red)' }} />
                      <h3>Immigration Services & Naturalization Center</h3>
                    </div>
                    <p>USCIS form assistants, Green Card renewal guides, and an interactive Civics Quiz.</p>

                    <div className="calc-grid" style={{ marginTop: '1rem' }}>
                      
                      {/* Naturalization Test Simulator */}
                      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <strong>🧠 Interactive US Civics Test Practice</strong>
                        <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>Correctly answer 6 questions to practice for your N-400 naturalization interview.</p>
                        
                        {!quizFinished ? (
                          <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Question {currentQuizIndex + 1} of {OFFICIAL_CIVICS_QUESTIONS.length}:</div>
                            <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', marginBottom: '0.5rem' }}>
                              {OFFICIAL_CIVICS_QUESTIONS[currentQuizIndex].question}
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              {OFFICIAL_CIVICS_QUESTIONS[currentQuizIndex].options.map(opt => (
                                <button 
                                  key={opt}
                                  className="btn btn-secondary"
                                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', textAlign: 'left', justifyContent: 'flex-start', border: selectedQuizOption === opt ? '2px solid var(--color-blue)' : '1px solid var(--border-color)' }}
                                  disabled={showQuizResult}
                                  onClick={() => handleQuizAnswer(opt)}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>

                            {showQuizResult && (
                              <div style={{ marginTop: '0.75rem' }}>
                                {selectedQuizOption === OFFICIAL_CIVICS_QUESTIONS[currentQuizIndex].answer ? (
                                  <span style={{ color: 'green', fontWeight: 'bold' }}>Correct!</span>
                                ) : (
                                  <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>Incorrect. Correct Answer: {OFFICIAL_CIVICS_QUESTIONS[currentQuizIndex].answer}</span>
                                )}
                                <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', marginLeft: '1rem' }} onClick={handleNextQuizQuestion}>Next Question</button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-blue)' }}>Score: {quizScore} / {OFFICIAL_CIVICS_QUESTIONS.length}</div>
                            <p style={{ fontSize: '0.85rem' }}>{quizScore >= 4 ? "Great job! You passed the naturalization criteria simulation." : "Review the answers and try again."}</p>
                            <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={resetQuiz}>Restart Quiz</button>
                          </div>
                        )}
                      </div>

                      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <strong>🛂 USCIS Visa Applications Checklist</strong>
                        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0, fontSize: '0.9rem' }}>
                          <li>Form I-130: Family Sponsor petition.</li>
                          <li>Form I-485: Register Permanent Residence / Adjust Status.</li>
                          <li>Form AR-11: Change of Address notification.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 👵 SENIOR DASHBOARD */}
                {userProfile.role === 'senior' && (
                  <div className="tool-container" style={{ marginTop: '1.5rem', borderLeft: '6px solid var(--color-red)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <User size={20} style={{ color: 'var(--color-red)' }} />
                      <h3>Senior Citizen Resource Hub</h3>
                    </div>
                    <p>Medicare timelines, social security payouts, and local elder advocacy programs in {userProfile.state}.</p>

                    <div className="calc-grid" style={{ marginTop: '1rem' }}>
                      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <strong>🏥 Medicare Eligibility Timetable</strong>
                        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0, fontSize: '0.9rem' }}>
                          <li>Part A (Hospital): Premium-free for most citizens who paid Medicare taxes.</li>
                          <li>Part B (Medical visits): Requires monthly premiums. Apply 3 months before turning 65.</li>
                        </ul>
                      </div>
                      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <strong>🛡️ Elder Law & Will Planning</strong>
                        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0, fontSize: '0.9rem' }}>
                          <li>Draft a Power of Attorney (POA) to assign financial or medical decisions.</li>
                          <li>Verify standard inheritance rules under the laws of {userProfile.state}.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🎓 STUDENT DASHBOARD */}
                {userProfile.role === 'student' && (
                  <div className="tool-container" style={{ marginTop: '1.5rem', borderLeft: '6px solid var(--color-blue)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <BookOpen size={20} style={{ color: 'var(--color-blue)' }} />
                      <h3>Student Aid & Loan Planner</h3>
                    </div>
                    <p>FAFSA advisors, student loan repayment tables, and college budgeting resources.</p>

                    <div className="calc-grid" style={{ marginTop: '1rem' }}>
                      
                      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <strong>🎓 Student Loan Repayment Estimator</strong>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <div className="calc-grid">
                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: '0.8rem' }}>Principal ($)</label>
                              <input type="number" className="form-input" style={{ padding: '0.35rem' }} value={studentDebt} onChange={(e) => setStudentDebt(e.target.value)} />
                            </div>
                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: '0.8rem' }}>Interest (%)</label>
                              <input type="number" className="form-input" style={{ padding: '0.35rem' }} value={studentInterest} onChange={(e) => setStudentInterest(e.target.value)} />
                            </div>
                          </div>
                          <button className="btn btn-primary" style={{ padding: '0.35rem', fontSize: '0.85rem' }} onClick={calculateStudentLoans}>Run Calculator</button>
                          
                          {studentLoanResult && (
                            <div style={{ fontSize: '0.85rem', padding: '0.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', marginTop: '0.25rem' }}>
                              Monthly Payment: <strong>${studentLoanResult.monthly}</strong><br />
                              Total Paid (with Interest): <strong>${studentLoanResult.total}</strong><br />
                              Interest share: <strong>${studentLoanResult.interest}</strong>
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <strong>📅 FAFSA Deadlines & Grants</strong>
                        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0, fontSize: '0.9rem' }}>
                          <li>Federal FAFSA portal opens October 1st.</li>
                          <li>Check state grant limits for {userProfile.state}.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* General Welcome dashboard grid */}
              <div className="dashboard-grid">
                <div className="dashboard-card" onClick={() => setCurrentTab('chat')} id="card-welcome-chat">
                  <div className="card-header-icon">💬</div>
                  <h3 className="card-title">Ask the Assistant</h3>
                  <span className="card-desc">Search laws, benefits, and guidelines in plain language. Can speak/listen.</span>
                  <button className="btn btn-secondary" style={{ padding: '0.4rem', marginTop: 'auto' }}>Go to Chat <ArrowRight size={14} /></button>
                </div>

                <div className="dashboard-card" onClick={() => setCurrentTab('legal')} id="card-welcome-legal">
                  <div className="card-header-icon">📄</div>
                  <h3 className="card-title">Draft US Legal Forms</h3>
                  <span className="card-desc">Generate print-ready Wills, Leases, NDAs, and Cease & Desists.</span>
                  <button className="btn btn-secondary" style={{ padding: '0.4rem', marginTop: 'auto' }}>Open Drafter <ArrowRight size={14} /></button>
                </div>

                {sessionUser && (
                  <div className="dashboard-card accent-red" id="card-welcome-locker">
                    <div className="card-header-icon">🗂️</div>
                    <h3 className="card-title">Cloud File Locker</h3>
                    <span className="card-desc">You have <strong>{savedDocList.length} saved document(s)</strong> stored in the Supabase database.</span>
                    <div style={{ maxHeight: '100px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                      {savedDocList.map(doc => (
                        <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', backgroundColor: 'var(--bg-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                          <span style={{ textTransform: 'uppercase' }}>{doc.doc_type} ({new Date(doc.created_at).toLocaleDateString()})</span>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button className="msg-action-btn" title="Load" onClick={() => {
                              setGeneratedDoc(doc.doc_content);
                              setSelectedDocType(doc.doc_type);
                              setDocWizardStep(4);
                              setCurrentTab('legal');
                            }}>
                              <FolderOpen size={12} />
                            </button>
                            <button className="msg-action-btn" title="Delete" onClick={() => deleteSavedDocument(doc.id)} style={{ color: 'var(--color-red)' }}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: CONSOLIDATED CHAT AI & CONVERSATION BOX */}
          {currentTab === 'chat' && (
            <div className="chat-container">
              <div className="module-header">
                <span className="module-badge">AI Assistant</span>
                <h2>Legal & Life AI Assistant</h2>
                <p className="module-description">
                  Ask questions about state laws, USCIS rules, FAFSA schedules, or Medicare. Powered by Gemini 2.5 Flash.
                </p>

                {/* Inline Console Actions Bar */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  <button 
                    className={`btn btn-secondary ${showChatMemory ? 'active' : ''}`} 
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => { setShowChatMemory(!showChatMemory); setShowImagePanel(false); setShowVisionPanel(false); }}
                  >
                    <Brain size={14} /> 🧠 Memory Brain ({learnings.length})
                  </button>
                  
                  <button 
                    className={`btn btn-secondary ${showImagePanel ? 'active' : ''}`} 
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => { setShowImagePanel(!showImagePanel); setShowChatMemory(false); setShowVisionPanel(false); }}
                  >
                    <ImageIcon size={14} /> 🎨 Draw Seal (NanoBanan)
                  </button>

                  <button 
                    className={`btn btn-secondary ${showVisionPanel ? 'active' : ''}`} 
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => { setShowVisionPanel(!showVisionPanel); setShowChatMemory(false); setShowImagePanel(false); }}
                  >
                    <Camera size={14} /> 👁️ Scan Doc (Vision)
                  </button>
                </div>
              </div>

              {/* INLINE DRAWER 1: MEMORY PANEL */}
              {showChatMemory && (
                <div style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '1.25rem' }} className="animate-slide-up">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', margin: 0 }}>🧠 What the Agent Has Learned (Trains with User)</h3>
                    <button className="msg-action-btn" onClick={() => setShowChatMemory(false)}>✕ Close</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxH: '120px', overflowY: 'auto' }}>
                    {learnings.length === 0 ? (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No facts learned yet. Tell the AI facts in chat or add below.</span>
                    ) : (
                      learnings.map(l => (
                        <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0.6rem', backgroundColor: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                          <span><strong>{l.learned_key}:</strong> {l.learned_value}</span>
                          <button className="msg-action-btn" style={{ color: 'var(--color-red)' }} onClick={() => handleDeleteMemory(l.id)}>✕</button>
                        </div>
                      ))
                    )}
                  </div>
                  <form onSubmit={handleAddMemory} style={{ display: 'flex', gap: '0.4rem', marginTop: '0.5rem' }}>
                    <input type="text" className="form-input" style={{ flex: 1, padding: '0.35rem', fontSize: '0.85rem' }} placeholder="Fact Type (e.g. Spouse Name)" value={newMemoryKey} onChange={(e) => setNewMemoryKey(e.target.value)} />
                    <input type="text" className="form-input" style={{ flex: 1, padding: '0.35rem', fontSize: '0.85rem' }} placeholder="Value (e.g. Jessica)" value={newMemoryValue} onChange={(e) => setNewMemoryValue(e.target.value)} />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>Add</button>
                  </form>
                </div>
              )}

              {/* INLINE DRAWER 2: NANOBANAN GRAPHIC GENERATOR */}
              {showImagePanel && (
                <div style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '1.25rem' }} className="animate-slide-up">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', margin: 0 }}>🎨 Draw US Seals & Graphics (NanoBanan)</h3>
                    <button className="msg-action-btn" onClick={() => setShowImagePanel(false)}>✕ Close</button>
                  </div>
                  <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>Describe a stamp or document header. Renders dynamically and inserts into chat.</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ flex: 1 }} 
                      placeholder="e.g., A golden seal for Dallas County"
                      value={imagePrompt} 
                      onChange={(e) => setImagePrompt(e.target.value)} 
                    />
                    <button className="btn btn-primary" onClick={runImageGenerator} disabled={imageGenerating}>
                      {imageGenerating ? "Generating..." : "Generate & Post"}
                    </button>
                  </div>
                </div>
              )}

              {/* INLINE DRAWER 3: VISION SCANNER */}
              {showVisionPanel && (
                <div style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '1.25rem' }} className="animate-slide-up">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', margin: 0 }}>👁️ NanoBanan Vision Document Scanner</h3>
                    <button className="msg-action-btn" onClick={() => setShowVisionPanel(false)}>✕ Close</button>
                  </div>
                  <p style={{ fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>Upload a photo/scan of a bill or passport. Extracts variables and posts results in chat.</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <input type="file" accept="image/*" className="form-input" style={{ flex: 1 }} onChange={handleImageUpload} />
                    {visionImage && <img src={visionImage} alt="preview" style={{ height: '40px', borderRadius: '4px', border: '1px solid var(--border-color)' }} />}
                    <button className="btn btn-primary" onClick={runVisionOCR} disabled={visionLoading || !visionImage}>
                      {visionLoading ? "Scanning Pixels..." : "Extract & Post"}
                    </button>
                  </div>
                </div>
              )}

              {/* Chat Message Logs */}
              <div className="chat-messages" id="chat-messages-log">
                {messages.map(msg => (
                  <div key={msg.id} className={`chat-message ${msg.sender === 'user' ? 'user' : 'assistant'}`}>
                    <div className="message-avatar">
                      {msg.sender === 'user' ? 'U' : 'AI'}
                    </div>
                    <div className="message-content">
                      <div className="message-text">
                        {renderFormattedText(msg.text)}
                      </div>
                      
                      {msg.image && (
                        <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                          <img src={msg.image} alt="AI Generated Graphic" style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }} />
                          <div style={{ marginTop: '0.35rem' }}>
                            <a href={msg.image} download="liberty_assist_seal.png" className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Download size={12} /> Download Image
                            </a>
                          </div>
                        </div>
                      )}

                      <div className="message-header-bar">
                        <span className="message-time">{msg.time}</span>
                        <div className="message-actions">
                          <button className="msg-action-btn" title="Read Aloud" onClick={() => speakText(msg.text)}>
                            <Volume2 size={14} />
                          </button>
                          <button className="msg-action-btn" title="Copy Text" onClick={() => {
                            navigator.clipboard.writeText(msg.text);
                            alert("Copied!");
                          }}>
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="chat-message assistant">
                    <div className="message-avatar">AI</div>
                    <div className="message-content">
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-blue)', display: 'inline-block', animation: 'pulse 1s infinite' }}></span>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-blue)', display: 'inline-block', animation: 'pulse 1s infinite 0.2s' }}></span>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-blue)', display: 'inline-block', animation: 'pulse 1s infinite 0.4s' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="chat-input-container">
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                  <input 
                    type="text" 
                    id="chat-text-input-field"
                    placeholder="Ask about passport status, state benefits, lease rules, or CLE criteria..."
                    className="chat-text-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <button 
                    type="button" 
                    id="btn-voice-input"
                    className={`chat-voice-btn ${isListening ? 'recording' : ''}`}
                    onClick={toggleSpeechRecognition}
                  >
                    {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  <button type="submit" id="btn-chat-send" className="chat-send-btn">
                    <Send size={18} />
                  </button>
                </form>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                  <span>US State rules: <strong>{US_STATES.find(s => s.code === userProfile.state)?.name} ({userProfile.state})</strong></span>
                  <span>Active Role: <strong>{userProfile.role.toUpperCase()}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: US DOCUMENT DRAFTER */}
          {currentTab === 'legal' && (
            <div className="module-body animate-slide-up">
              <div className="module-header" style={{ padding: '0 0 1rem 0' }}>
                <span className="module-badge">Templates</span>
                <h2>US Legal Document Drafter</h2>
                <p className="module-description">
                  Draft state-compliant contracts and orders. Review and download.
                </p>
              </div>

              {docWizardStep === 1 && (
                <div className="tool-container">
                  <h3>Choose a Document Template</h3>
                  <p>State jurisdiction: <strong>{US_STATES.find(s => s.code === userProfile.state)?.name} ({userProfile.state})</strong></p>
                  
                  <div className="form-group">
                    <label className="form-label">Template Type</label>
                    <select className="form-select" value={selectedDocType} onChange={(e) => setSelectedDocType(e.target.value)}>
                      <option value="will">Last Will and Testament</option>
                      <option value="lease">Residential Lease Agreement</option>
                      <option value="nda">Mutual Non-Disclosure Agreement (NDA)</option>
                      <option value="cease">Cease and Desist Order</option>
                    </select>
                  </div>

                  <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => setDocWizardStep(2)}>
                    Start Wizard <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {docWizardStep === 2 && (
                <div className="step-wizard">
                  <div className="wizard-progress">
                    <div className="progress-dot completed"></div>
                    <div className="progress-dot active"></div>
                    <div className="progress-dot"></div>
                  </div>

                  <h3>Document Basic Information</h3>

                  {selectedDocType === 'will' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Full Name (Testator)</label>
                        <input type="text" className="form-input" placeholder="e.g. Samuel Green" value={willData.fullName} onChange={(e) => setWillData({...willData, fullName: e.target.value})} />
                      </div>
                      <div className="calc-grid">
                        <div className="form-group">
                          <label className="form-label">City</label>
                          <input type="text" className="form-input" placeholder="e.g. Austin" value={willData.city} onChange={(e) => setWillData({...willData, city: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">County</label>
                          <input type="text" className="form-input" placeholder="e.g. Travis" value={willData.county} onChange={(e) => setWillData({...willData, county: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Spouse Name (If married)</label>
                        <input type="text" className="form-input" placeholder="e.g. Margaret Green" value={willData.spouseName} onChange={(e) => setWillData({...willData, spouseName: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Do you have children?</label>
                        <select className="form-select" value={willData.hasChildren} onChange={(e) => setWillData({...willData, hasChildren: e.target.value})}>
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      {willData.hasChildren === 'yes' && (
                        <div className="form-group">
                          <label className="form-label">Children's Names</label>
                          <input type="text" className="form-input" placeholder="e.g. Lisa Green, John Green" value={willData.childrenNames} onChange={(e) => setWillData({...willData, childrenNames: e.target.value})} />
                        </div>
                      )}
                    </div>
                  )}

                  {selectedDocType === 'lease' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="calc-grid">
                        <div className="form-group">
                          <label className="form-label">Landlord Name</label>
                          <input type="text" className="form-input" placeholder="e.g. George Miller" value={leaseData.landlordName} onChange={(e) => setLeaseData({...leaseData, landlordName: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Tenant Name</label>
                          <input type="text" className="form-input" placeholder="e.g. Brenda Carter" value={leaseData.tenantName} onChange={(e) => setLeaseData({...leaseData, tenantName: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Rental Address</label>
                        <input type="text" className="form-input" placeholder="e.g. 504 Congress Ave, Austin, TX 78701" value={leaseData.propertyAddress} onChange={(e) => setLeaseData({...leaseData, propertyAddress: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {selectedDocType === 'nda' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Disclosing Party</label>
                        <input type="text" className="form-input" placeholder="e.g. Apex Tech Corp" value={ndaData.disclosingParty} onChange={(e) => setNdaData({...ndaData, disclosingParty: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Receiving Party</label>
                        <input type="text" className="form-input" placeholder="e.g. John Doe (Contractor)" value={ndaData.receivingParty} onChange={(e) => setNdaData({...ndaData, receivingParty: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {selectedDocType === 'cease' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="calc-grid">
                        <div className="form-group">
                          <label className="form-label">Sender Name (Your name)</label>
                          <input type="text" className="form-input" placeholder="e.g. Alice Cooper" value={ceaseData.senderName} onChange={(e) => setCeaseData({...ceaseData, senderName: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Recipient Name (Harassing party)</label>
                          <input type="text" className="form-input" placeholder="e.g. Bob Vance" value={ceaseData.recipientName} onChange={(e) => setCeaseData({...ceaseData, recipientName: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Reason for Action</label>
                        <select className="form-select" value={ceaseData.reason} onChange={(e) => setCeaseData({...ceaseData, reason: e.target.value})}>
                          <option value="harassment">Unlawful Harassment</option>
                          <option value="copyright infringement">Copyright / IP Infringement</option>
                          <option value="defamation">Defamation / Slander</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="wizard-nav">
                    <button className="btn btn-secondary" onClick={() => setDocWizardStep(2)}>Back</button>
                    <button className="btn btn-primary" onClick={() => setDocWizardStep(3)}>Next <ChevronRight size={16} /></button>
                  </div>
                </div>
              )}

              {docWizardStep === 3 && (
                <div className="step-wizard">
                  <div className="wizard-progress">
                    <div className="progress-dot completed"></div>
                    <div className="progress-dot completed"></div>
                    <div className="progress-dot active"></div>
                  </div>

                  <h3>Finalizing Parameters</h3>

                  {selectedDocType === 'will' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Primary Beneficiary</label>
                        <input type="text" className="form-input" value={willData.primaryBeneficiary} onChange={(e) => setWillData({...willData, primaryBeneficiary: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Alternate Beneficiary</label>
                        <input type="text" className="form-input" value={willData.alternateBeneficiary} onChange={(e) => setWillData({...willData, alternateBeneficiary: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Executor Name</label>
                        <input type="text" className="form-input" value={willData.executorName} onChange={(e) => setWillData({...willData, executorName: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {selectedDocType === 'lease' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="calc-grid">
                        <div className="form-group">
                          <label className="form-label">Rent ($)</label>
                          <input type="number" className="form-input" value={leaseData.monthlyRent} onChange={(e) => setLeaseData({...leaseData, monthlyRent: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Security Deposit ($)</label>
                          <input type="number" className="form-input" value={leaseData.securityDeposit} onChange={(e) => setLeaseData({...leaseData, securityDeposit: e.target.value})} />
                        </div>
                      </div>
                      <div className="calc-grid">
                        <div className="form-group">
                          <label className="form-label">Start Date</label>
                          <input type="text" className="form-input" value={leaseData.startDate} onChange={(e) => setLeaseData({...leaseData, startDate: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Pets?</label>
                          <select className="form-select" value={leaseData.petsAllowed} onChange={(e) => setLeaseData({...leaseData, petsAllowed: e.target.value})}>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedDocType === 'nda' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Purpose of NDA</label>
                        <input type="text" className="form-input" value={ndaData.purpose} onChange={(e) => setNdaData({...ndaData, purpose: e.target.value})} />
                      </div>
                      <div className="calc-grid">
                        <div className="form-group">
                          <label className="form-label">Duration</label>
                          <select className="form-select" value={ndaData.duration} onChange={(e) => setNdaData({...ndaData, duration: e.target.value})}>
                            <option value="2 years">2 Years</option>
                            <option value="5 years">5 Years</option>
                            <option value="Indefinitely">Indefinitely</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Jurisdiction State</label>
                          <select className="form-select" value={ndaData.stateJurisdiction} onChange={(e) => setNdaData({...ndaData, stateJurisdiction: e.target.value})}>
                            {US_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedDocType === 'cease' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Explain actions/infringements specifically</label>
                        <textarea className="form-input" style={{ height: '100px' }} placeholder="Provide dates and concrete descriptions of their conduct..." value={ceaseData.details} onChange={(e) => setCeaseData({...ceaseData, details: e.target.value})} />
                      </div>
                    </div>
                  )}

                  <div className="wizard-nav">
                    <button className="btn btn-secondary" onClick={() => setDocWizardStep(2)}>Back</button>
                    <button className="btn btn-red" onClick={generateLegalDocument}>Draft Legal Document <FileText size={16} /></button>
                  </div>
                </div>
              )}

              {docWizardStep === 4 && (
                <div className="doc-output-container">
                  <div className="doc-toolbar">
                    <span style={{ fontWeight: 'bold', color: 'var(--color-blue)' }}>✏️ Document Preview</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => speakText(generatedDoc)}>
                        <Volume2 size={14} /> Read
                      </button>
                      <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => {
                        navigator.clipboard.writeText(generatedDoc);
                        alert("Copied!");
                      }}>
                        <Copy size={14} /> Copy
                      </button>
                      
                      {sessionUser && (
                        <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={saveGeneratedDocument}>
                          <Download size={14} /> Save Cloud
                        </button>
                      )}

                      <button className="btn btn-red" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => {
                        const printWindow = window.open('', '_blank');
                        printWindow.document.write(`<pre style="font-family: Lora, Georgia, serif; font-size: 14px; padding: 40px; white-space: pre-wrap;">${generatedDoc}</pre>`);
                        printWindow.document.close();
                        printWindow.print();
                      }}>
                        <Printer size={14} /> Print
                      </button>
                    </div>
                  </div>

                  <div className="doc-paper">
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                      {generatedDoc}
                    </pre>
                  </div>

                  <div className="doc-disclaimer">
                    <strong>⚠️ Execution Guidelines:</strong> Sign before two neutral witnesses. Notary verification recommended.
                  </div>

                  <button className="btn btn-secondary" style={{ alignSelf: 'flex-start' }} onClick={() => setDocWizardStep(1)}>
                    <RotateCcw size={16} /> Draft Another Document
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: ACADEMIC STUDY DESK (PWA Student Feature) */}
          {currentTab === 'study' && (
            <div className="module-body animate-slide-up">
              <div className="module-header" style={{ padding: '0 0 1rem 0' }}>
                <span className="module-badge">Studies</span>
                <h2>Academic Study Desk</h2>
                <p className="module-description">
                  Draft essay plans, run study timers, and practice flashcards to boost your US coursework.
                </p>
              </div>

              {/* Pomodoro widget */}
              <div className="tool-container">
                <h3>⏱️ Pomodoro Study Block Timer</h3>
                <p>Run a focused session. Active focus promotes high-quality study habits.</p>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', margin: '0.5rem 0' }}>
                  <div style={{ fontSize: '3rem', fontWeight: '800', fontFamily: 'monospace', color: 'var(--color-red)' }}>
                    {String(pomodoroMinutes).padStart(2, '0')}:{String(pomodoroSeconds).padStart(2, '0')}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" onClick={() => {
                      setPomodoroActive(!pomodoroActive);
                      if (!pomodoroActive && speechEnabled) speakText("Study session activated. Stay focused!");
                    }}>
                      {pomodoroActive ? "Pause Timer" : "Start Focus"}
                    </button>
                    <button className="btn btn-secondary" onClick={() => {
                      setPomodoroActive(false);
                      setPomodoroMinutes(25);
                      setPomodoroSeconds(0);
                    }}>Reset</button>
                    
                    {/* Direct leads to calendar */}
                    <a 
                      href={getGoogleCalendarLink("Study Focus Block", new Date(), "Focused Study Session on LibertyAssist")}
                      target="_blank"
                      className="btn btn-secondary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Calendar size={14} /> Schedule in Google Calendar
                    </a>
                  </div>
                </div>
              </div>

              {/* Essay Outline Generator */}
              <div className="tool-container">
                <h3>📝 Essay Outline Builder</h3>
                <p>Enter your topic prompt to build a structural essay outline.</p>
                <div className="calc-grid">
                  <div className="calc-inputs">
                    <div className="form-group">
                      <label className="form-label">Essay Topic / Theme</label>
                      <input type="text" className="form-input" value={essayPrompt} onChange={(e) => setEssayPrompt(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" onClick={generateEssayOutline}>Generate Essay Outline Plan</button>
                  </div>
                  <div className="doc-output-container" style={{ margin: 0 }}>
                    <div style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap', maxHeight: '180px', overflowY: 'auto' }}>
                      {renderFormattedText(essayOutline)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Flashcards */}
              <div className="tool-container">
                <h3>🎓 US Gov & History Memorization Flashcards</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '1rem 0' }}>
                  <div 
                    onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                    style={{ width: '100%', maxWidth: '360px', height: '180px', perspective: '1000px', cursor: 'pointer' }}
                  >
                    <div style={{ width: '100%', height: '100%', position: 'relative', transition: 'transform 0.6s', transformStyle: 'preserve-3d', transform: flashcardFlipped ? 'rotateY(180deg)' : 'none', border: '2px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
                      
                      {/* Front */}
                      <div style={{ position: 'absolute', backfaceVisibility: 'hidden', display: flashcardFlipped ? 'none' : 'block' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-blue)', fontWeight: 'bold', textTransform: 'uppercase' }}>Flashcard</span>
                        <h4 style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem' }}>{STUDY_FLASHCARDS[flashcardIndex].term}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '1rem' }}>Click Card to Flip</span>
                      </div>

                      {/* Back */}
                      <div style={{ position: 'absolute', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', display: flashcardFlipped ? 'block' : 'none' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-red)', fontWeight: 'bold', textTransform: 'uppercase' }}>Definition</span>
                        <p style={{ fontSize: '1.05rem', marginTop: '0.5rem' }}>{STUDY_FLASHCARDS[flashcardIndex].def}</p>
                      </div>

                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" onClick={() => {
                      setFlashcardFlipped(false);
                      setFlashcardIndex(prev => (prev - 1 + STUDY_FLASHCARDS.length) % STUDY_FLASHCARDS.length);
                    }}>Prev</button>
                    <button className="btn btn-secondary" onClick={() => {
                      setFlashcardFlipped(false);
                      setFlashcardIndex(prev => (prev + 1) % STUDY_FLASHCARDS.length);
                    }}>Next</button>
                    <button className="btn btn-secondary" onClick={() => speakText(STUDY_FLASHCARDS[flashcardIndex].def)} title="Listen to definition">
                      <Volume2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: WORK ASSISTANT DESK (For all workers) */}
          {currentTab === 'worker' && (
            <div className="module-body animate-slide-up">
              <div className="module-header" style={{ padding: '0 0 1rem 0' }}>
                <span className="module-badge">Workforce</span>
                <h2>Professional Work Assistant Desk</h2>
                <p className="module-description">
                  Generate LinkedIn profiles, schedule shifts, and track gig mileage deductions.
                </p>
              </div>

              {/* Bio Generator */}
              <div className="tool-container">
                <h3>💼 Professional LinkedIn/Resume Biography Writer</h3>
                <div className="calc-grid">
                  <div className="calc-inputs">
                    <div className="form-group">
                      <label className="form-label">Job Title / Role</label>
                      <input type="text" className="form-input" value={workerBioRole} onChange={(e) => setWorkerBioRole(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Skills (comma separated)</label>
                      <input type="text" className="form-input" value={workerBioSkills} onChange={(e) => setWorkerBioSkills(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tone</label>
                      <select className="form-select" value={workerBioTone} onChange={(e) => setWorkerBioTone(e.target.value)}>
                        <option value="formal">Formal & Corporate</option>
                        <option value="creative">Creative & Friendly</option>
                      </select>
                    </div>
                    <button className="btn btn-primary" onClick={generateWorkerProfile}>Generate Biography</button>
                  </div>
                  <div className="doc-output-container" style={{ margin: 0, justifyContent: 'center' }}>
                    <div style={{ fontStyle: 'italic', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      {generatedWorkerBio}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shift Planner & Google Calendar */}
              <div className="tool-container">
                <h3>📅 Daily Shift Scheduler</h3>
                <p>Plan shifts, add meetings, and link directly to your calendar app.</p>
                <div className="calc-grid">
                  <div className="calc-inputs">
                    <div className="calc-grid">
                      <div className="form-group">
                        <label className="form-label">Shift Start Time</label>
                        <input type="text" className="form-input" value={workerShiftStart} onChange={(e) => setWorkerShiftStart(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Shift End Time</label>
                        <input type="text" className="form-input" value={workerShiftEnd} onChange={(e) => setWorkerShiftEnd(e.target.value)} />
                      </div>
                    </div>
                    <button className="btn btn-primary" onClick={generateWorkShiftSchedule}>Draft Itinerary</button>
                  </div>
                  <div className="doc-output-container" style={{ margin: 0 }}>
                    <div style={{ fontSize: '0.85rem' }}>
                      {renderFormattedText(workerShiftSchedule)}
                    </div>
                    <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                      <a 
                        href={getGoogleCalendarLink("Work Shift", new Date(), `Work shift scheduled on LibertyAssist: ${workerShiftStart} - ${workerShiftEnd}`)}
                        target="_blank"
                        className="btn btn-red"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                      >
                        <Calendar size={12} /> Schedule Shift in Google Calendar
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contractor schedule c miles */}
              <div className="tool-container">
                <h3>🚗 Gig Worker Mileage Deduction Estimator (Schedule C)</h3>
                <p>Enter business driving miles to estimate standard IRS business deductions.</p>
                <div className="calc-grid">
                  <div className="calc-inputs">
                    <div className="form-group">
                      <label className="form-label">Miles Driven for Business (Annual)</label>
                      <input type="number" className="form-input" value={contractorMiles} onChange={(e) => setContractorMiles(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" onClick={calculateGigDeductions}>Calculate deduction</button>
                  </div>
                  {contractorDeduction && (
                    <div className="calc-results">
                      <span>Estimated IRS Tax Deduction</span>
                      <div className="calc-value">${parseFloat(contractorDeduction).toLocaleString()}</div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Calculated at 2026 standard IRS rate of <strong>$0.685</strong> per mile.
                      </span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB: PERSONAL FINANCE HUB */}
          {currentTab === 'finance' && (
            <div className="module-body animate-slide-up">
              <div className="module-header" style={{ padding: '0 0 1rem 0' }}>
                <span className="module-badge">Calculators</span>
                <h2>Personal Finance & Tax Hub</h2>
                <p className="module-description">
                  Plan your household budget, estimate federal tax rates, and estimate student loans.
                </p>
              </div>

              {/* Tax Brackets Estimator */}
              <div className="tool-container" id="tax-bracket-estimator">
                <h3>💵 US Federal Tax & Standard Deduction Estimator (2026 Rates)</h3>
                <div className="calc-grid">
                  <div className="calc-inputs">
                    <div className="form-group">
                      <label className="form-label">Filing Status</label>
                      <select className="form-select" value={taxFilingStatus} onChange={(e) => setTaxFilingStatus(e.target.value)}>
                        <option value="single">Single Filer</option>
                        <option value="joint">Married Filing Jointly</option>
                        <option value="head">Head of Household</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Annual Gross Income ($)</label>
                      <input type="number" className="form-input" value={taxIncome} onChange={(e) => setTaxIncome(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" onClick={calculateTaxes}>Run Calculator</button>
                  </div>

                  {taxResult && (
                    <div className="calc-results">
                      <span>Estimated Federal Income Tax</span>
                      <div className="calc-value">${parseFloat(taxResult.tax).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                      <div style={{ fontSize: '0.85rem', margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
                        Effective Tax Rate: <strong>{taxResult.rate}%</strong><br />
                        Standard Deduction: <strong>${taxResult.deduction.toLocaleString()}</strong><br />
                        Taxable Income: <strong>${parseFloat(taxResult.taxable).toLocaleString()}</strong>
                      </div>
                      <div className="legend-item" style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.4rem 0.8rem', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }}>
                        <span>Take-Home Pay (After Fed Tax): <strong>${parseFloat(taxResult.takehome).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Household Budget Calculator */}
              <div className="tool-container" id="budget-planner-container">
                <h3>🏠 50 / 30 / 20 Personal Budget Planner</h3>
                <div className="calc-grid">
                  <div className="calc-inputs">
                    <div className="form-group">
                      <label className="form-label">Monthly Take-Home Income ($)</label>
                      <input type="number" className="form-input" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} />
                    </div>
                    <div className="calc-grid">
                      <div className="form-group">
                        <label className="form-label">Rent/Mortgage ($)</label>
                        <input type="number" className="form-input" value={rentExpense} onChange={(e) => setRentExpense(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Groceries/Food ($)</label>
                        <input type="number" className="form-input" value={foodExpense} onChange={(e) => setFoodExpense(e.target.value)} />
                      </div>
                    </div>
                    <div className="calc-grid">
                      <div className="form-group">
                        <label className="form-label">Utilities ($)</label>
                        <input type="number" className="form-input" value={utilExpense} onChange={(e) => setUtilExpense(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Leisure/Others ($)</label>
                        <input type="number" className="form-input" value={otherExpense} onChange={(e) => setOtherExpense(e.target.value)} />
                      </div>
                    </div>
                    <button className="btn btn-primary" onClick={calculateBudget}>Analyze Budget</button>
                  </div>

                  {budgetReport && (
                    <div className="calc-results" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <span>Remaining Monthly Surplus / Savings</span>
                      <div className="calc-value" style={{ color: budgetReport.savings >= 0 ? 'var(--color-blue)' : 'var(--color-red)' }}>
                        ${budgetReport.savings.toLocaleString()}
                      </div>
                      
                      <div style={{ width: '100%' }}>
                        <div style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span>Budget Spent Ratio:</span>
                          <strong>{((budgetReport.spent / monthlyIncome) * 100).toFixed(0)}%</strong>
                        </div>
                        <div className="calc-chart">
                          <div className="chart-segment blue" style={{ width: `${budgetReport.needsPct}%` }}></div>
                          <div className="chart-segment red" style={{ width: `${budgetReport.wantsPct}%` }}></div>
                          <div className="chart-segment grey" style={{ width: `${Math.max(0, budgetReport.savingsPct)}%` }}></div>
                        </div>
                      </div>

                      <div className="chart-legend">
                        <div className="legend-item"><div className="legend-dot blue"></div> <span>Needs (Target 50%): <strong>{budgetReport.needsPct}%</strong> (${budgetReport.needs.toLocaleString()})</span></div>
                        <div className="legend-item"><div className="legend-dot red"></div> <span>Wants (Target 30%): <strong>{budgetReport.wantsPct}%</strong> (${budgetReport.wants.toLocaleString()})</span></div>
                        <div className="legend-item"><div className="legend-dot grey"></div> <span>Savings (Target 20%): <strong>{Math.max(0, budgetReport.savingsPct)}%</strong> (${budgetReport.savings.toLocaleString()})</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CIVIC SERVICES HELPER */}
          {currentTab === 'civic' && (
            <div className="module-body animate-slide-up">
              <div className="module-header" style={{ padding: '0 0 1rem 0' }}>
                <span className="module-badge">Citizenship</span>
                <h2>Civic & Government Services Helper</h2>
                <p className="module-description">
                  Check eligibility requirements for US welfare, apply for passports, and verify voting instructions in your home state.
                </p>
              </div>

              {/* Passport checklist */}
              <div className="tool-container" id="passport-checklist">
                <h3>🇺🇸 US Passport Application Guide & Checklist</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--color-blue)', flexShrink: 0 }} />
                    <div>
                      <strong>Form Selection:</strong> Use Form DS-11 if applying for the first time or under age 16. Use Form DS-82 for renewals by mail.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--color-blue)', flexShrink: 0 }} />
                    <div>
                      <strong>Proof of Citizenship:</strong> Original US birth certificate or naturalization certificate.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--color-blue)', flexShrink: 0 }} />
                    <div>
                      <strong>Photo Requirements:</strong> One 2x2 inch color photo on plain white background. Taken in the last 6 months.
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--color-blue)', flexShrink: 0 }} />
                    <div>
                      <strong>Fees:</strong> $130 application fee for adult passport books.
                    </div>
                  </div>
                </div>
              </div>

              {/* Voter Registration Info */}
              <div className="tool-container" id="voter-registration-guide">
                <h3>🗳️ Voting Registration Guide for {US_STATES.find(s => s.code === userProfile.state)?.name}</h3>
                <div className="simplified-card" style={{ borderLeft: '6px solid var(--color-blue)', backgroundColor: 'var(--color-blue-light)' }}>
                  <strong>How to register to vote in {userProfile.state}:</strong>
                  <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0 }}>
                    <li>You must be a US citizen and 18 years old by Election Day.</li>
                    <li>Online registration is available in most US states.</li>
                    <li>Make sure to register at least 15 to 30 days before elections depending on local rules.</li>
                  </ul>
                  <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => window.open('https://vote.gov', '_blank')}>Visit Vote.gov <ArrowRight size={14} /></button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HEALTHCARE JARGON TRANSLATOR */}
          {currentTab === 'healthcare' && (
            <div className="module-body animate-slide-up">
              <div className="module-header" style={{ padding: '0 0 1rem 0' }}>
                <span className="module-badge">Healthcare</span>
                <h2>Health Insurance & Invoice Translator</h2>
                <p className="module-description">
                  Learn what health insurance terms mean and calculate exactly what you owe.
                </p>
              </div>

              <div className="tool-container" id="healthcare-glossary">
                <h3>🔍 Plain-English Medical Terminology Glossary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <strong style={{ color: 'var(--color-blue)' }}>Premium:</strong> The amount of money you pay every month to the health insurance company just to keep your coverage active.
                  </div>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <strong style={{ color: 'var(--color-blue)' }}>Deductible:</strong> The amount you have to pay out-of-pocket for medical care *before* the insurance company starts covering costs.
                  </div>
                  <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <strong style={{ color: 'var(--color-blue)' }}>Copay (Copayment):</strong> A flat fee you pay at the doctor's office or pharmacy at the time of service.
                  </div>
                </div>
              </div>

              {/* Healthcare Bill Calculator */}
              <div className="tool-container" id="medical-bill-calculator">
                <h3>🏥 Interactive Healthcare Bill Cost Calculator</h3>
                <div className="calc-grid">
                  <div className="calc-inputs">
                    <div className="form-group">
                      <label className="form-label">Total Medical Bill Invoice ($)</label>
                      <input type="number" className="form-input" value={medicalBill} onChange={(e) => setMedicalBill(e.target.value)} />
                    </div>
                    <div className="calc-grid">
                      <div className="form-group">
                        <label className="form-label">Remaining Deductible ($)</label>
                        <input type="number" className="form-input" value={deductibleRemaining} onChange={(e) => setDeductibleRemaining(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Insurance Co-Insurance (%)</label>
                        <input type="number" className="form-input" value={coInsurance} onChange={(e) => setCoInsurance(e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Flat Office Co-Pay ($)</label>
                      <input type="number" className="form-input" value={coPay} onChange={(e) => setCoPay(e.target.value)} />
                    </div>
                    <button className="btn btn-primary" onClick={calculateHealthcareCost}>Calculate Bill Share</button>
                  </div>

                  {healthcareBreakdown && (
                    <div className="calc-results">
                      <span>Your Estimated Out-Of-Pocket Cost</span>
                      <div className="calc-value" style={{ color: 'var(--color-red)' }}>
                        ${healthcareBreakdown.patientTotal}
                      </div>
                      <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                        {healthcareBreakdown.breakdown}
                      </div>
                      <div className="legend-item" style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.4rem 0.8rem', borderRadius: '8px', width: '100%', boxSizing: 'border-box', marginTop: '1rem' }}>
                        <span>Insurance Company Pays: <strong>${healthcareBreakdown.insuranceTotal}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PERSONAL COORDINATOR & CHECKLIST */}
          {currentTab === 'coordinator' && (
            <div className="module-body animate-slide-up">
              <div className="module-header" style={{ padding: '0 0 1rem 0' }}>
                <span className="module-badge">Organization</span>
                <h2>Personal Coordinator & Email Writer</h2>
                <p className="module-description">
                  Draft formal requests, schedule events directly to your calendar, and maintain checklists.
                </p>
              </div>

              {/* Form Email Drafter */}
              <div className="tool-container" id="email-drafter-container">
                <h3>✉️ US Formal Email Writer Wizard</h3>
                <div className="calc-grid">
                  <div className="calc-inputs">
                    <div className="form-group">
                      <label className="form-label">Email Template</label>
                      <select className="form-select" value={emailTemplate} onChange={(e) => setEmailTemplate(e.target.value)}>
                        <option value="landlord_repair">Request Repair from Landlord</option>
                        <option value="time_off">Request Time Off from Supervisor</option>
                        <option value="school_excuse">Absence Excuse Note for School</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Recipient Name</label>
                      <input type="text" className="form-input" placeholder="e.g. Mr. Miller" value={emailInputs.recipient} onChange={(e) => setEmailInputs({...emailInputs, recipient: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Detail 1 (Description / Reason)</label>
                      <input type="text" className="form-input" placeholder="..." value={emailInputs.detail1} onChange={(e) => setEmailInputs({...emailInputs, detail1: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Detail 2 (Dates / Location)</label>
                      <input type="text" className="form-input" placeholder="..." value={emailInputs.detail2} onChange={(e) => setEmailInputs({...emailInputs, detail2: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Your Name</label>
                      <input type="text" className="form-input" placeholder="e.g. John Doe" value={emailInputs.senderName} onChange={(e) => setEmailInputs({...emailInputs, senderName: e.target.value})} />
                    </div>
                    <button className="btn btn-primary" onClick={generateEmailDraft}>Draft Email</button>
                  </div>

                  <div className="doc-output-container" style={{ margin: 0 }}>
                    <div className="doc-toolbar" style={{ paddingBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Draft Output</span>
                      <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => {
                        navigator.clipboard.writeText(draftedEmail);
                        alert("Copied!");
                      }}>
                        <Copy size={12} /> Copy
                      </button>
                    </div>
                    <textarea 
                      id="email-draft-box"
                      className="form-input" 
                      style={{ height: '240px', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.4' }}
                      value={draftedEmail}
                      onChange={(e) => setDraftedEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="tool-container" id="daily-checklist-container">
                <h3>✅ Interactive Checklist & Appointment Planner</h3>
                <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input type="text" id="new-task-input" className="form-input" style={{ flex: 1 }} placeholder="e.g., Doctor appointment on 2026-10-15..." value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} />
                  <button type="submit" id="btn-add-task" className="btn btn-primary">Add</button>
                </form>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {tasks.map(task => (
                    <div key={task.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flex: 1 }} onClick={() => toggleTask(task.id)}>
                        <input type="checkbox" checked={task.completed} onChange={() => {}} style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>{task.text}</span>
                      </div>
                      
                      {/* Direct Lead to Google Calendar */}
                      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                        <a 
                          href={getGoogleCalendarLink(task.text, new Date(), "Scheduled from LibertyAssist Task Manager Checklist")}
                          target="_blank"
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                          title="Schedule in Google Calendar"
                        >
                          <Calendar size={12} /> Calendar
                        </a>
                        <button className="msg-action-btn" style={{ color: 'var(--color-red)' }} onClick={() => deleteTask(task.id)}><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {currentTab === 'settings' && (
            <div className="module-body animate-slide-up">
              <div className="module-header" style={{ padding: '0 0 1rem 0' }}>
                <span className="module-badge">Connections</span>
                <h2>System Connection Management</h2>
                <p className="module-description">
                  Link LibertyAssist to your Supabase backend to enable multi-user accounts, saving documents, and persistent chat storage.
                </p>
              </div>

              <div className="tool-container" id="api-settings-panel">
                <h3>⚡ Supabase Database Connection</h3>
                <p>Plug in your Supabase credentials. Once connected, accounts, documents, and chats are saved in the cloud. If left blank, local storage simulation is automatically used.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Supabase URL (SUPABASE_URL)</label>
                    <input type="text" className="form-input" placeholder="https://xyz.supabase.co" value={sbUrl} onChange={(e) => setSbUrl(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Supabase Anon Key (SUPABASE_ANON_KEY)</label>
                    <input type="password" className="form-input" placeholder="..." value={sbKey} onChange={(e) => setSbKey(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button className="btn btn-primary" onClick={() => {
                    localStorage.setItem('liberty_assist_supabase_url', sbUrl);
                    localStorage.setItem('liberty_assist_supabase_key', sbKey);
                    alert("Supabase credentials saved. Checking database connection...");
                    checkActiveSession();
                  }}>Save Database Connection</button>
                  
                  {(sbUrl || sbKey) && (
                    <button className="btn btn-secondary" style={{ color: 'var(--color-red)', borderColor: 'var(--color-red)' }} onClick={() => {
                      setSbUrl('');
                      setSbKey('');
                      localStorage.removeItem('liberty_assist_supabase_url');
                      localStorage.removeItem('liberty_assist_supabase_key');
                      alert("Disconnected. Operating in local sandbox mode.");
                      setSessionUser(null);
                    }}>Disconnect Database</button>
                  )}
                </div>
              </div>

              <div className="tool-container">
                <h3>🔑 Google Gemini API Integration</h3>
                <p>Provide your Google AI Studio key to enable live responses from the **Gemini 2.5 Flash** model. If left blank, rule-based simulator handles your requests.</p>
                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <label className="form-label">Gemini API Key</label>
                  <input type="password" className="form-input" placeholder="AIzaSy..." value={geminiKey} onChange={(e) => setGeminiKey(e.target.value)} />
                </div>
                <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => {
                  localStorage.setItem('liberty_assist_gemini_key', geminiKey);
                  alert("Gemini key saved.");
                }}>Save Gemini Key</button>
              </div>

              {/* SQL script helper */}
              <div className="tool-container">
                <h3>🖥️ Supabase Table Initialization SQL</h3>
                <textarea 
                  className="form-input" 
                  readOnly 
                  style={{ height: '220px', fontFamily: 'monospace', fontSize: '0.8rem', backgroundColor: 'var(--bg-secondary)' }} 
                  value={`-- Create Profile Custom Metadata Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  role text default 'citizen',
  state text default 'NY',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS and public policies
alter table public.profiles enable row level security;
create policy "Allow users to view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Allow users to update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Allow profile creation" on public.profiles for insert with check (true);

-- Create Chat Logs Table
create table public.chat_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  sender text not null,
  message text not null,
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.chat_history enable row level security;
create policy "Users can see own chats" on public.chat_history for select using (auth.uid() = user_id);
create policy "Users can save own chats" on public.chat_history for insert with check (auth.uid() = user_id);

-- Create Saved Documents Locker Table
create table public.saved_documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  doc_type text not null,
  doc_content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.saved_documents enable row level security;
create policy "Users can see own documents" on public.saved_documents for select using (auth.uid() = user_id);
create policy "Users can save documents" on public.saved_documents for insert with check (auth.uid() = user_id);
create policy "Users can delete documents" on public.saved_documents for delete using (auth.uid() = user_id);

-- Create User Learnings / Memory Table
create table public.user_learnings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  learned_key text not null,
  learned_value text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_learnings enable row level security;
create policy "Users can see own learnings" on public.user_learnings for select using (auth.uid() = user_id);
create policy "Users can insert learnings" on public.user_learnings for insert with check (auth.uid() = user_id);
create policy "Users can update learnings" on public.user_learnings for update using (auth.uid() = user_id);
create policy "Users can delete learnings" on public.user_learnings for delete using (auth.uid() = user_id);`}
                />
              </div>
            </div>
          )}

        </main>
      </div>

      {speechEnabled && (
        <div className="voice-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Volume2 size={16} />
            <span>Voice Readout is Active (Click speaker icons next to text to read aloud)</span>
          </div>
          <button className="voice-close" onClick={stopSpeaking}>Stop Speaking ⏹️</button>
        </div>
      )}
    </div>
  );
}
