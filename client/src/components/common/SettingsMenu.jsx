import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Mail, Bell, Loader2, Check, Send } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useLocalStorage('userEmail', '');
  const [tempEmail, setTempEmail] = useState(email);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!tempEmail || !isValidEmail(tempEmail)) {
      setSubscriptionStatus({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setIsSubscribing(true);
    setSubscriptionStatus(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: tempEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmail(tempEmail);
        setSubscriptionStatus({ 
          type: 'success', 
          message: 'Successfully subscribed! You\'ll receive email alerts for upcoming space events.' 
        });
      } else {
        setSubscriptionStatus({ 
          type: 'error', 
          message: data.message || 'Failed to subscribe. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscriptionStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection.' 
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!email) return;

    setIsSubscribing(true);
    setSubscriptionStatus(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/notifications/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setEmail('');
        setTempEmail('');
        setSubscriptionStatus({ 
          type: 'success', 
          message: 'Successfully unsubscribed from email alerts.' 
        });
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setSubscriptionStatus({ 
        type: 'error', 
        message: 'Failed to unsubscribe. Please try again.' 
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSendTest = async () => {
    const testEmail = email || tempEmail;
    
    if (!testEmail || !isValidEmail(testEmail)) {
      setSubscriptionStatus({ 
        type: 'error', 
        message: 'Please enter a valid email address first' 
      });
      return;
    }

    setIsSendingTest(true);
    setSubscriptionStatus(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/notifications/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus({ 
          type: 'success', 
          message: '📧 Test email sent! Check your inbox (and spam folder).' 
        });
      } else {
        setSubscriptionStatus({ 
          type: 'error', 
          message: data.message || 'Failed to send test email. Check server configuration.' 
        });
      }
    } catch (error) {
      console.error('Test email error:', error);
      setSubscriptionStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection.' 
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-muted-gray hover:text-star-white hover:bg-bg-tertiary transition-colors duration-200"
        aria-label="Settings Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Settings Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-bg-secondary border border-white/10 rounded-2xl shadow-2xl z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-electric-blue" />
                  <h3 className="text-lg font-bold font-heading text-star-white">
                    Email Alerts
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-bg-tertiary rounded-lg transition-colors"
                  aria-label="Close settings"
                >
                  <X className="w-5 h-5 text-muted-gray" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <p className="text-sm text-muted-gray">
                  Get notified via email about upcoming celestial events like ISS passes, planet visibility, and moon phases.
                </p>

                {/* Email Form */}
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-star-white mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-gray" />
                      <input
                        id="email"
                        type="email"
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full pl-10 pr-4 py-3 bg-bg-tertiary border border-white/10 rounded-lg text-star-white placeholder:text-faint-gray focus:border-electric-blue/50 focus:ring-2 focus:ring-electric-blue/20 transition-all outline-none"
                        disabled={isSubscribing}
                      />
                    </div>
                  </div>

                  {/* Status Message */}
                  {subscriptionStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                        subscriptionStatus.type === 'success'
                          ? 'bg-aurora-green/10 text-aurora-green border border-aurora-green/20'
                          : 'bg-danger-red/10 text-danger-red border border-danger-red/20'
                      }`}
                    >
                      {subscriptionStatus.type === 'success' ? (
                        <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      )}
                      <span>{subscriptionStatus.message}</span>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {email ? (
                      <>
                        <button
                          type="submit"
                          disabled={isSubscribing || tempEmail === email}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-electric-blue text-white rounded-lg font-semibold transition-all hover:bg-electric-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubscribing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <Bell className="w-4 h-4" />
                              Update Email
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleUnsubscribe}
                          disabled={isSubscribing}
                          className="px-4 py-2.5 bg-danger-red/10 text-danger-red border border-danger-red/30 rounded-lg font-semibold transition-all hover:bg-danger-red/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Unsubscribe
                        </button>
                      </>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubscribing}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-electric-blue to-cosmic-purple text-white rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(79,156,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubscribing ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Bell className="w-4 h-4" />
                            Subscribe to Alerts
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Test Email Button */}
                  {(email || (tempEmail && isValidEmail(tempEmail))) && (
                    <button
                      type="button"
                      onClick={handleSendTest}
                      disabled={isSendingTest || isSubscribing}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-bg-tertiary border border-white/10 text-star-white rounded-lg font-medium transition-all hover:border-electric-blue/50 hover:bg-bg-tertiary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSendingTest ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Test Email
                        </>
                      )}
                    </button>
                  )}
                </form>

                {/* Info */}
                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs text-muted-gray">
                    💡 You'll receive emails 24 hours before each event. You can unsubscribe anytime.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export { SettingsMenu };
