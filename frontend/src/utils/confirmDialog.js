export function confirmAction(message = "Möchten Sie diesen Eintrag wirklich löschen?") {
  return new Promise((resolve) => {
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
          width: min(430px, 100%);
          background: white;
          border-radius: 22px;
          padding: 28px;
          box-shadow: 0 30px 80px rgba(15, 23, 42, 0.25);
          border: 1px solid #dbeafe;
        }
        .cb-confirm-box h3 {
          margin: 0 0 12px;
          color: #14264f;
          font-size: 1.4rem;
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
        .cb-confirm-actions button {
          border: none;
          border-radius: 14px;
          padding: 0.8rem 1.1rem;
          font-weight: 800;
          cursor: pointer;
        }
        .cb-cancel {
          background: #f1f5f9;
          color: #14264f;
        }
        .cb-delete {
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
        <h3>Löschen bestätigen</h3>
        <p>${message}</p>
        <div class="cb-confirm-actions">
          <button class="cb-cancel" type="button">Abbrechen</button>
          <button class="cb-delete" type="button">Löschen</button>
        </div>
      </div>
    `;

    const close = (value) => {
      overlay.remove();
      resolve(value);
    };

    overlay.querySelector(".cb-cancel").addEventListener("click", () => close(false));
    overlay.querySelector(".cb-delete").addEventListener("click", () => close(true));
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close(false);
    });

    document.body.appendChild(overlay);
  });
}
