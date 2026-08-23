import "./Fortune.css";

function Fortune({
  fortune,
  onClose,
}) {
  if (!fortune) {
    return null;
  }

  return (
    <div className="fortune">

      <div className="fortune-content">

        <span className="fortune-star">
          ✦
        </span>

        <div className="fortune-text">

          <span className="fortune-label">
            PICKS CONFIRMED
          </span>

          <p>
            {fortune}
          </p>

        </div>

        <button
          className="fortune-close"
          onClick={onClose}
          aria-label="Close fortune"
        >
          ×
        </button>

      </div>

    </div>
  );
}

export default Fortune;