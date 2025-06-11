(function () {
  "use strict";

  class YouTubeModalManager {
    constructor() {
      this.players = {};
      this.apiReady = false;
      this.init();
    }

    init() {
      if (typeof window === "undefined" || typeof document === "undefined") {
        console.error("YouTubeModalManager: Browser environment required");
        return;
      }

      this.loadYouTubeAPI();
      this.setupEventListeners();
    }

    loadYouTubeAPI() {
      try {
        if (window.YT && window.YT.Player) {
          this.apiReady = true;
          this.onYouTubeAPIReady();
          return;
        }

        if (!document.createElement) {
          console.error("YouTubeModalManager: Cannot create script elements");
          return;
        }

        const tag = document.createElement("script");
        if (!tag) {
          console.error("YouTubeModalManager: Failed to create script tag");
          return;
        }

        tag.src = "https://www.youtube.com/iframe_api";
        tag.onerror = function () {
          console.error("YouTubeModalManager: Failed to load YouTube API");
        };

        const firstScriptTag = document.getElementsByTagName("script")[0];
        if (!firstScriptTag || !firstScriptTag.parentNode) {
          document.head.appendChild(tag);
        } else {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        const self = this;
        window.onYouTubeIframeAPIReady = function () {
          self.apiReady = true;
          self.onYouTubeAPIReady();
        };
      } catch (error) {
        console.error("YouTubeModalManager: Error loading YouTube API:", error);
      }
    }

    onYouTubeAPIReady() {
      // YouTube API is ready
    }

    setupEventListeners() {
      try {
        const self = this;

        // Setup standard .c-lb triggers
        const triggers = document.querySelectorAll(".c-lb");
        if (triggers && triggers.length > 0) {
          triggers.forEach(function (trigger, index) {
            if (!trigger) return;

            trigger.addEventListener("click", function (e) {
              if (e && e.preventDefault) {
                e.preventDefault();
              }
              self.openModal(index);
            });
          });
        } else {
          console.warn("YouTubeModalManager: No .c-lb elements found");
        }

        // Setup custom triggers that target specific modals
        this.setupCustomTriggers();
        this.setupCloseListeners();

        document.addEventListener("keydown", function (e) {
          if (e && e.key === "Escape") {
            self.closeAllModals();
          }
        });
      } catch (error) {
        console.error(
          "YouTubeModalManager: Error setting up event listeners:",
          error
        );
      }
    }

    setupCustomTriggers() {
      try {
        const self = this;

        // Find elements with data-trigger-modal attribute
        const customTriggers = document.querySelectorAll(
          "[data-trigger-modal]"
        );

        if (!customTriggers || customTriggers.length === 0) {
          return; // No custom triggers found, that's fine
        }

        customTriggers.forEach(function (trigger) {
          if (!trigger || !trigger.dataset) return;

          const targetIndex = trigger.dataset.triggerModal;

          // Validate target index
          if (!targetIndex || targetIndex.trim() === "") {
            return;
          }

          trigger.addEventListener("click", function (e) {
            if (e && e.preventDefault) {
              e.preventDefault();
            }

            // Convert to number and validate
            const modalIndex = parseInt(targetIndex, 10);
            if (isNaN(modalIndex) || modalIndex < 0) {
              return;
            }

            self.openModal(modalIndex);
          });
        });
      } catch (error) {
        console.error(
          "YouTubeModalManager: Error setting up custom triggers:",
          error
        );
      }
    }

    setupCloseListeners() {
      try {
        const self = this;
        const closeButtons = document.querySelectorAll(
          ".c-icon.lb-modalc-close-btn"
        );
        if (closeButtons && closeButtons.length > 0) {
          closeButtons.forEach(function (btn) {
            if (!btn) return;

            btn.addEventListener("click", function (e) {
              if (e && e.preventDefault) {
                e.preventDefault();
              }
              self.closeAllModals();
            });
          });
        }

        const overlays = document.querySelectorAll(".c-lb-modal-overlay");
        if (overlays && overlays.length > 0) {
          overlays.forEach(function (overlay) {
            if (!overlay) return;

            overlay.addEventListener("click", function (e) {
              if (e && e.target === overlay) {
                self.closeAllModals();
              }
            });
          });
        }
      } catch (error) {
        console.error(
          "YouTubeModalManager: Error setting up close listeners:",
          error
        );
      }
    }

    openModal(index) {
      try {
        if (typeof index !== "number" || index < 0) {
          console.error("YouTubeModalManager: Invalid modal index:", index);
          return;
        }

        const modals = document.querySelectorAll(".c-lb-modal");

        if (!modals || modals.length === 0) {
          console.error("YouTubeModalManager: No .c-lb-modal elements found");
          return;
        }

        if (index >= modals.length) {
          console.error(
            "YouTubeModalManager: Modal with index " +
              index +
              " not found. Available modals: " +
              modals.length
          );
          return;
        }

        const modal = modals[index];
        if (!modal) {
          console.error(
            "YouTubeModalManager: Modal at index " +
              index +
              " is null or undefined"
          );
          return;
        }

        this.closeAllModals();
        modal.classList.add("is-open");
        this.initializePlayer(index, modal);

        if (document.body && document.body.style) {
          document.body.style.overflow = "hidden";
        }
      } catch (error) {
        console.error("YouTubeModalManager: Error opening modal:", error);
      }
    }

    initializePlayer(index, modal) {
      try {
        const self = this;
        if (!this.apiReady || !window.YT || !window.YT.Player) {
          console.warn("YouTubeModalManager: YouTube API not ready yet");
          setTimeout(function () {
            if (self.apiReady) {
              self.initializePlayer(index, modal);
            }
          }, 500);
          return;
        }

        if (!modal) {
          console.error("YouTubeModalManager: Modal is null or undefined");
          return;
        }

        const playerContainer = modal.querySelector(
          ".youtube-player-container"
        );

        if (!playerContainer) {
          console.error(
            "YouTubeModalManager: .youtube-player-container not found in modal"
          );
          return;
        }

        let videoId = null;

        if (playerContainer.dataset) {
          videoId =
            playerContainer.dataset.videoId ||
            playerContainer.dataset.youtubeId ||
            playerContainer.dataset.video ||
            playerContainer.dataset.youtube;
        }

        if (!videoId) {
          const triggers = document.querySelectorAll(".c-lb");
          const trigger = triggers[index];
          if (trigger && trigger.dataset) {
            videoId =
              trigger.dataset.videoId ||
              trigger.dataset.youtubeId ||
              trigger.dataset.video ||
              trigger.dataset.youtube;
          }
        }

        if (videoId) {
          videoId = this.extractVideoId(videoId);
        }

        if (!videoId || videoId.trim() === "") {
          console.error(
            "YouTubeModalManager: Video ID not found in data-video-id attribute"
          );
          return;
        }

        const playerId = "youtube-player-" + index;

        let playerElement = playerContainer.querySelector("#" + playerId);
        if (!playerElement) {
          playerElement = document.createElement("div");
          if (playerElement) {
            playerElement.id = playerId;
            playerContainer.appendChild(playerElement);
          } else {
            console.error(
              "YouTubeModalManager: Failed to create player element"
            );
            return;
          }
        }

        if (this.players[index]) {
          try {
            if (typeof this.players[index].stopVideo === "function") {
              this.players[index].stopVideo();
            }
            if (typeof this.players[index].destroy === "function") {
              this.players[index].destroy();
            }
          } catch (destroyError) {
            console.warn(
              "YouTubeModalManager: Error destroying existing player:",
              destroyError
            );
          }
          delete this.players[index];
        }

        this.players[index] = new YT.Player(playerId, {
          videoId: videoId.trim(),
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            controls: 1,
            disablekb: 0,
            fs: 1,
          },
          events: {
            onReady: function (event) {
              if (
                event &&
                event.target &&
                typeof event.target.playVideo === "function"
              ) {
                try {
                  event.target.playVideo();
                } catch (playError) {
                  // Error starting video playback
                }
              }
            },
            onStateChange: function (event) {
              // Handle player state changes if needed
            },
            onError: function (event) {
              // Handle player errors
            },
          },
        });
      } catch (error) {
        console.error("YouTubeModalManager: Error initializing player:", error);
      }
    }

    closeAllModals() {
      try {
        const openModals = document.querySelectorAll(".c-lb-modal.is-open");

        if (!openModals || openModals.length === 0) {
          return;
        }

        const allModals = document.querySelectorAll(".c-lb-modal");
        const self = this;

        openModals.forEach(function (modal) {
          if (!modal) return;

          modal.classList.remove("is-open");

          if (allModals && allModals.length > 0) {
            const modalIndex = Array.from(allModals).indexOf(modal);
            if (modalIndex !== -1 && self.players[modalIndex]) {
              try {
                if (typeof self.players[modalIndex].stopVideo === "function") {
                  self.players[modalIndex].stopVideo();
                }
              } catch (stopError) {
                console.warn(
                  "YouTubeModalManager: Error stopping video " +
                    modalIndex +
                    ":",
                  stopError
                );
              }
            }
          }
        });

        if (document.body && document.body.style) {
          document.body.style.overflow = "";
        }
      } catch (error) {
        console.error("YouTubeModalManager: Error closing modals:", error);
      }
    }

    extractVideoId(input) {
      if (!input || typeof input !== "string") {
        return null;
      }

      input = input.trim();

      if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
        return input;
      }

      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
        /v=([a-zA-Z0-9_-]{11})/,
        /\/embed\/([a-zA-Z0-9_-]{11})/,
        /\/v\/([a-zA-Z0-9_-]{11})/,
        /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      ];

      for (var i = 0; i < patterns.length; i++) {
        const match = input.match(patterns[i]);
        if (match && match[1]) {
          return match[1];
        }
      }

      return input;
    }

    destroyAllPlayers() {
      try {
        const self = this;
        Object.keys(this.players).forEach(function (index) {
          if (self.players[index]) {
            try {
              if (typeof self.players[index].stopVideo === "function") {
                self.players[index].stopVideo();
              }
              if (typeof self.players[index].destroy === "function") {
                self.players[index].destroy();
              }
            } catch (destroyError) {
              console.warn(
                "YouTubeModalManager: Error destroying player " + index + ":",
                destroyError
              );
            }
          }
        });
        this.players = {};
      } catch (error) {
        console.error(
          "YouTubeModalManager: Error destroying all players:",
          error
        );
      }
    }

    isAPIReady() {
      return this.apiReady && window.YT && window.YT.Player;
    }

    getPlayer(index) {
      if (typeof index !== "number" || index < 0) {
        console.error("YouTubeModalManager: Invalid player index:", index);
        return null;
      }
      return this.players[index] || null;
    }

    setVideoId(modalIndex, videoId) {
      try {
        if (typeof modalIndex !== "number" || modalIndex < 0) {
          console.error(
            "YouTubeModalManager: Invalid modal index:",
            modalIndex
          );
          return false;
        }

        const modals = document.querySelectorAll(".c-lb-modal");
        if (!modals || modalIndex >= modals.length) {
          console.error(
            "YouTubeModalManager: Modal not found at index:",
            modalIndex
          );
          return false;
        }

        const modal = modals[modalIndex];
        const container = modal.querySelector(".youtube-player-container");

        if (!container) {
          console.error(
            "YouTubeModalManager: Player container not found in modal"
          );
          return false;
        }

        container.dataset.videoId = this.extractVideoId(videoId);
        return true;
      } catch (error) {
        console.error("YouTubeModalManager: Error setting video ID:", error);
        return false;
      }
    }

    // Public method to manually trigger a specific modal
    triggerModal(index) {
      this.openModal(index);
    }

    // Public method to add custom trigger programmatically
    addCustomTrigger(element, modalIndex) {
      try {
        if (!element || typeof modalIndex !== "number" || modalIndex < 0) {
          console.error("YouTubeModalManager: Invalid element or modal index");
          return false;
        }

        const self = this;
        element.addEventListener("click", function (e) {
          if (e && e.preventDefault) {
            e.preventDefault();
          }
          self.openModal(modalIndex);
        });

        return true;
      } catch (error) {
        console.error(
          "YouTubeModalManager: Error adding custom trigger:",
          error
        );
        return false;
      }
    }
  }

  function initializeYouTubeModalManager() {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      try {
        window.youtubeModalManager = new YouTubeModalManager();
      } catch (error) {
        console.error("Failed to initialize YouTubeModalManager:", error);
      }
    }
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener(
        "DOMContentLoaded",
        initializeYouTubeModalManager
      );
    } else {
      initializeYouTubeModalManager();
    }
  }
})();
