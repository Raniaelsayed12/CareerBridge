export function confirmAction(message, options = {}) {
  return new Promise((resolve) => {
    const title = options.title || "Löschen bestätigen";
    const confirmText = options.confirmText || "Löschen";
    const cancelText = options.cancelText || "Abbrechen";

    if (!document.getElementById("cb-confirm-style")) {
      const style = document.createElement("style");
      style.id = "cb-confirm-style";
      style.textContent = `
        .cb-confirm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          padding: 20px;
        }
        .cb-confirm-box {
          width: min(440px, 100%);
          background: #ffffff;
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 30px 80px rgba(15, 23, 42, 0.25);
          border: 1px solid #dbeafe;
          font-family: inherit;
        }
        .cb-confirm-box h3 {
          margin: 0 0 12px;
          color: #14264f;
          font-size: 1.45rem;
        }
        .cb-confirm-box p {
          margin: 0;
          color: #475569;
          line-height: 1.6;
        }
        .cb-confirm-actions {
          margin-top: 24px;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .cb-confirm-cancel,
        .cb-confirm-ok {
          border: none;
          border-radius: 14px;
          padding: 0.85rem 1.15rem;
          font-weight: 800;
          cursor: pointer;
        }
        .cb-confirm-cancel {
          background: #f1f5f9;
          color: #14264f;
        }
        .cb-confirm-ok {
          background: #ef4444;
          color: white;
        }
      `;
      document.head.appendChild(style);
    }

    const overlay = document.createElement("div");
    overlay.className = "cb-confirm-overlay";

    overlay.innerHTML = `
      <div class="cb-confirm-box">
        <h3></h3>
        <p></p>
        <div class="cb-confirm-actions">
          <button class="cb-confirm-cancel" type="button"></button>
          <button class="cb-confirm-ok" type="button"></button>
        </div>
      </div>
    `;

    overlay.querySelector("h3").textContent = title;
    overlay.querySelector("p").textContent = message;
    overlay.querySelector(".cb-confirm-cancel").textContent = cancelText;
    overlay.querySelector(".cb-confirm-ok").textContent = confirmText;

    const close = (value) => {
      overlay.remove();
      resolve(value);
    };

    overlay.querySelector(".cb-confirm-cancel").addEventListener("click", () => close(false));
    overlay.querySelector(".cb-confirm-ok").addEventListener("click", () => close(true));
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close(false);
    });

    document.body.appendChild(overlay);
  });
}
