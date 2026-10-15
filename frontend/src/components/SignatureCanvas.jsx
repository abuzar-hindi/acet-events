// SignatureCanvas.jsx — wraps react-signature-canvas with resize handling
import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SigCanvas = forwardRef(function SigCanvas({ onBegin, onEnd }, ref) {
  const sigRef   = useRef(null);
  const wrapRef  = useRef(null);

  // Resize canvas to match wrapper dimensions
  const resizeCanvas = () => {
    const canvas = sigRef.current?.getCanvas();
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    // Save existing drawing as dataURL, resize, then restore
    const data = sigRef.current.isEmpty() ? null : sigRef.current.toDataURL();
    const ratio = window.devicePixelRatio || 1;
    canvas.width  = wrap.offsetWidth  * ratio;
    canvas.height = wrap.offsetHeight * ratio;
    canvas.style.width  = `${wrap.offsetWidth}px`;
    canvas.style.height = `${wrap.offsetHeight}px`;
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);

    if (data) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, wrap.offsetWidth, wrap.offsetHeight);
      img.src = data;
    }
  };

  useEffect(() => {
    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    isEmpty:   () => sigRef.current?.isEmpty() ?? true,
    toDataURL: (type) => sigRef.current?.toDataURL(type),
    clear:     () => sigRef.current?.clear(),
  }));

  return (
    <div
      ref={wrapRef}
      className="sig-canvas-wrapper w-full"
      style={{ height: '220px' }}
    >
      <SignatureCanvas
        ref={sigRef}
        penColor="#1a0050"
        canvasProps={{
          style: {
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            background: 'transparent',
            touchAction: 'none',
          },
        }}
        onBegin={onBegin}
        onEnd={onEnd}
      />
    </div>
  );
});

export default SigCanvas;
