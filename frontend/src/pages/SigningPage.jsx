import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eraser, CheckCircle2, Loader2, AlertCircle, PenTool } from 'lucide-react';
import SigCanvas from '../components/SignatureCanvas';
import RichTextRenderer from '../components/RichTextRenderer';
import FestiveBackground from '../components/FestiveBackground';
import { CornerOrnament } from '../components/Ornaments';
import { fetchFacultyById, submitSignature, fetchEvent, getUploadUrl } from '../services/api';
import { getLocalEventConfig } from '../data/eventConfig';
import logo from '../assets/logo.png'

export default function SigningPage() {
  const { facultyId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [eventConfig, setEventConfig] = useState(getLocalEventConfig());
  const [faculty, setFaculty] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [fetchErr, setFetchErr] = useState('');
  const [isEmpty, setIsEmpty] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState('');

  // Fetch latest event settings from MongoDB backend
  useEffect(() => {
    fetchEvent()
      .then((data) => {
        if (data && data.title) {
          setEventConfig((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => { });
  }, []);

  // Load faculty details from backend
  useEffect(() => {
    if (!facultyId) {
      setFetchErr('No faculty member ID specified.');
      setFetching(false);
      return;
    }

    fetchFacultyById(facultyId)
      .then((data) => {
        if (data.invitation?.status === 'signed') {
          // Already signed — redirect directly to thank-you experience
          navigate(`/thank-you/${facultyId}`, { replace: true, state: { faculty: data } });
        } else {
          setFaculty(data);
        }
      })
      .catch((err) => {
        const msg =
          err?.response?.status === 404
            ? 'Faculty member not found in the event database.'
            : err?.response?.status === 400
              ? 'Invalid faculty ID format.'
              : 'Could not load faculty details from the server. Please check connection.';
        setFetchErr(msg);
      })
      .finally(() => setFetching(false));
  }, [facultyId, navigate]);

  const handleClear = () => {
    canvasRef.current?.clear();
    setIsEmpty(true);
    setSubmitErr('');
  };

  const dataURLtoBlob = (dataURL) => {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const arr = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
    return new Blob([arr], { type: mime });
  };

  const handleSubmit = async () => {
    if (canvasRef.current?.isEmpty()) {
      setSubmitErr('Please draw your signature in the box before submitting.');
      return;
    }

    setSubmitting(true);
    setSubmitErr('');

    try {
      const dataURL = canvasRef.current.toDataURL('image/png');
      const blob = dataURLtoBlob(dataURL);

      // Submit to backend API
      const result = await submitSignature(facultyId, blob);

      // Strictly on success, navigate to thank-you page
      navigate(`/thank-you/${facultyId}`, {
        state: {
          faculty: result.faculty,
          signatureDataURL: dataURL,
        },
      });
    } catch (err) {
      // Do not navigate to the thank-you page if the backend reports a failure
      const msg =
        err?.response?.data?.message ||
        'Submission failed. Unable to save signature to the server. Please check your connection and try again.';
      setSubmitErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const invitationMessageToShow =
    faculty?.customMessage && faculty.customMessage.trim().length > 0
      ? faculty.customMessage
      : eventConfig.invitationMessage;

  const initials = faculty?.name
    ? faculty.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('')
    : 'FM';

  return (
    <FestiveBackground variant="ivory" centeredMandala={true}>
      {/* Top festive ornamental banner */}
      <div
        className="h-1.5"
        style={{
          background: 'linear-gradient(90deg, #d4a017, #ff6f00, #e91e63, #9c27b0, #e91e63, #ff6f00, #d4a017)',
        }}
      />

      {/* Top Header Navigation */}
      <header className="px-4 py-4 max-w-3xl mx-auto w-full flex items-center justify-between border-b border-[#d4a017]/25">
        <button
          onClick={() => navigate('/faculty')}
          className="inline-flex items-center gap-2 font-mukta text-sm text-[#3d1070] hover:text-[#e91e63] font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Faculty List</span>
        </button>

        <div className="flex items-center gap-2">
          <img src={logo} alt="ACET" className="w-9 h-9 object-contain filter drop-shadow-sm" />
          <span className="font-mukta font-bold text-sm text-[#3d1070]">
            {eventConfig.title}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl">

          {/* Loading state */}
          {fetching && (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-[#3d1070]">
              <Loader2 size={32} className="animate-spin text-[#ff6f00]" />
              <p className="font-mukta text-sm font-medium">Opening personalized invitation…</p>
            </div>
          )}

          {/* Fetch error */}
          {!fetching && fetchErr && (
            <div className="text-center py-16 p-8 rounded-2xl bg-white/90 border border-[#d4a017]/40 text-[#3d1070] shadow-xl">
              <p className="text-4xl mb-3">⚠️</p>
              <h2 className="font-display text-xl mb-2 font-bold text-[#3d1070]">Invitation Details Unavailable</h2>
              <p className="font-mukta text-sm text-[#7e57c2] mb-6">{fetchErr}</p>
              <button onClick={() => navigate('/faculty')} className="btn-gold btn-sm">
                Return to Faculty List
              </button>
            </div>
          )}

          {/* Signing Card — Warm Ivory Parchment Surface with Refined Borders */}
          {!fetching && !fetchErr && faculty && (
            <div className="relative animate-slide-up">

              {/* Decorative Glow */}
              <div
                className="absolute -inset-2 rounded-3xl pointer-events-none"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(212,160,23,0.35) 0%, rgba(233,30,99,0.18) 50%, rgba(212,160,23,0.35) 100%)',
                  filter: 'blur(3px)',
                }}
              />

              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  background: 'linear-gradient(175deg, #ffffff 0%, #fffdf8 50%, #fdf8ee 100%)',
                  border: '1.5px solid rgba(212,160,23,0.35)',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
                }}
              >
                {/* Top card stripe */}
                <div
                  className="h-1.5"
                  style={{
                    background: 'linear-gradient(90deg, #d4a017, #ff6f00, #e91e63)',
                  }}
                />

                {/* Inner hairline border */}
                <div
                  className="absolute inset-3 rounded-xl pointer-events-none"
                  style={{ border: '1px solid rgba(212,160,23,0.20)' }}
                />

                {/* Corner Ornaments */}
                <CornerOrnament className="absolute top-4 left-4 text-gold-500 opacity-60" style={{ color: '#d4a017' }} />
                <CornerOrnament className="absolute top-4 right-4 text-gold-500 opacity-60" style={{ color: '#d4a017' }} flip />

                <div className="px-6 sm:px-10 py-8 sm:py-10 text-center">

                  {/* 2. Distinctive Hindi & English Heading */}
                  <p className="font-devanagari text-lg sm:text-xl font-bold text-[#e91e63] mb-8">
                    हस्ताक्षर करें · आमंत्रण स्वीकारें
                  </p>

                  {/* 3. Compact Faculty Identity Badge */}
                  <div className="flex flex-col items-center justify-center gap-3 mb-8 text-left">
                    {faculty.photo ? (
                      <img
                        src={getUploadUrl(faculty.photo)}
                        alt={faculty.name}
                        className="w-24 rounded-full object-cover border-2 border-gold-400 shrink-0"
                      />
                    ) : (
                      <div></div>
                    )}
                    <div>
                      <p className="font-mukta font-bold text-lg text-[#3d1070] leading">
                        {faculty.name}
                      </p>
                      {faculty.designation && (
                        <p className="font-mukta text-md text-center text-[#7e57c2]">
                          {faculty.designation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 4. EXACT RULE: Only ONE Invitation Message Visible (Direct on surface) */}
                  <div className="font-mukta text-sm sm:text-base leading-relaxed text-[#2d1a5e] mb-6 text-left max-w-lg mx-auto">
                    <RichTextRenderer text={invitationMessageToShow} pClassName="mb-3 last:mb-0" />
                  </div>

                  {/* 5. Short Signing Instruction */}
                  <div className="flex items-center justify-center gap-2 mb-2 text-xs font-mukta font-semibold text-[#5e35b1]">
                    <span>Please sign in the box below</span>
                  </div>

                  {/* 6. Signature Canvas Box */}
                  <div
                    className="relative rounded-xl mb-4 overflow-hidden"
                    style={{
                      border: isEmpty
                        ? '1.5px dashed rgba(212,160,23,0.50)'
                        : '1.5px solid #d4a017',
                      background: '#ffffff',
                      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04)',
                    }}
                  >
                    {isEmpty && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-purple-900/25">
                        <PenTool size={26} />
                        <span className="font-mukta text-xs mt-1.5">Sign here</span>
                      </div>
                    )}

                    <SigCanvas
                      ref={canvasRef}
                      onBegin={() => {
                        setIsEmpty(false);
                        setSubmitErr('');
                      }}
                      onEnd={() => setIsEmpty(canvasRef.current?.isEmpty() ?? true)}
                    />
                  </div>

                  {/* Error Message */}
                  {submitErr && (
                    <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-xs font-mukta bg-rose-50 border border-rose-200 text-rose-700 text-left">
                      <AlertCircle size={15} className="shrink-0 text-rose-500" />
                      <span>{submitErr}</span>
                    </div>
                  )}

                  {/* 7. Action Buttons: Clear & Submit Signature */}
                  <div className="flex gap-3 pt-1">
                    <button
                      id="clear-signature-btn"
                      type="button"
                      onClick={handleClear}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-mukta font-semibold text-sm transition-colors border"
                      style={{
                        borderColor: 'rgba(94,53,177,0.25)',
                        color: '#5e35b1',
                        background: 'transparent',
                      }}
                    >
                      <Eraser size={15} />
                      Clear
                    </button>

                    <button
                      id="submit-signature-btn"
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting || isEmpty}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-mukta font-semibold text-sm text-white transition-all shadow-md"
                      style={{
                        background: isEmpty
                          ? 'rgba(255,111,0,0.40)'
                          : 'linear-gradient(135deg, #ff6f00 0%, #e91e63 100%)',
                        boxShadow: isEmpty ? 'none' : '0 4px 18px rgba(255,111,0,0.40)',
                        cursor: submitting || isEmpty ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.75 : 1,
                      }}
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          Submit Signature
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-5 text-xs text-[#7e57c2] font-mukta border-t border-[#d4a017]/20">
        <div>ACET College, Aligarh · Dandiya Celebration 2026</div>
        <p className="text-[11px] text-[#9a5500]/75 mt-1 font-medium tracking-wide">
          Crafted by the MCA Department
        </p>
      </footer>
    </FestiveBackground>
  );
}
