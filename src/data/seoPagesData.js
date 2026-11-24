/**
 * Zyvokio SEO Pages Configuration & Tool Registry
 * ────────────────────────────────────────────────
 * Comprehensive SEO metadata, content, schemas, FAQs, and guides
 * for individual Google SEO tool pages.
 */

export const SEO_TOOLS = [
  // ==========================================
  // 1. IMAGE CONVERSION TOOLS
  // ==========================================
  {
    slug: 'jpg-to-png',
    type: 'image-convert',
    name: 'JPG to PNG Converter',
    h1: 'Convert JPG to PNG Online Free',
    badge: 'Lossless Transparency',
    iconName: 'Image',
    fromFormat: 'jpg',
    toFormat: 'png',
    metaTitle: 'JPG to PNG Converter — 100% Free & Lossless | Zyvokio',
    metaDescription: 'Convert JPG to PNG online for free with studio-grade fidelity. Add transparency support, preserve sharp details, and download instantly with zero file size limits.',
    keywords: ['jpg to png', 'convert jpg to png', 'jpeg to png', 'image converter', 'jpg to transparent png', 'free online jpg to png'],
    lead: 'Transform standard JPG photos into high-fidelity PNG images with full alpha channel transparency. Powered by lossless in-memory processing with no compression artifacts.',
    howTo: [
      { step: 1, title: 'Upload JPG Images', desc: 'Drag and drop your JPG or JPEG files into the converter or click to browse.' },
      { step: 2, title: 'Process with Sharp', desc: 'Our engine parses the image in memory and generates crisp PNG pixels with zero quality degradation.' },
      { step: 3, title: 'Download Lossless PNG', desc: 'Click Download to save your converted PNG file immediately or batch download all as a ZIP.' }
    ],
    features: [
      { title: 'Alpha Channel Transparency', desc: 'PNG supports clean 24-bit alpha channels, perfect for logos, graphics, and web design.' },
      { title: 'Studio-Grade Sharp Engine', desc: 'Powered by libvips and Sharp for blistering speeds and zero compression noise.' },
      { title: '100% In-Memory Privacy', desc: 'Files are processed strictly in RAM and never stored in any database or tracking server.' },
      { title: 'Unlimited Batch Conversions', desc: 'Convert dozens of JPG photos simultaneously with no daily usage caps or watermarks.' }
    ],
    infoSections: [
      {
        heading: 'Why Convert JPG to PNG?',
        text: 'JPG is a lossy compression format optimized for photographs, which means every time a JPG is edited and re-saved, it loses subtle details. In contrast, PNG is a lossless bitmap format that preserves every single pixel exactly as intended. Converting your JPG to PNG is ideal when you plan to edit graphics, add transparent backgrounds, or need pristine visual clarity for web assets.'
      },
      {
        heading: 'JPG vs PNG: Key Differences',
        text: 'While JPG produces smaller file sizes suited for digital photography, PNG provides superior sharpness for text, line art, icons, and illustrations. Furthermore, PNG supports 8-bit and 24-bit transparency, which JPG fundamentally lacks. Zyvokio ensures that during conversion, your images retain full color fidelity without introduction of banding or digital artifacts.'
      }
    ],
    faqs: [
      { q: 'Is converting JPG to PNG completely free?', a: 'Yes! Zyvokio is 100% free with no hidden subscriptions, no sign-ups required, and no watermarks added to your images.' },
      { q: 'Will my converted PNG lose image quality?', a: 'No. PNG is a lossless format, so every detail present in your source JPG is preserved with maximum precision.' },
      { q: 'Can I convert multiple JPG files at once?', a: 'Yes. You can select or drag-and-drop multiple JPG files into the queue and click "Convert All" to process them in batch.' },
      { q: 'Are my uploaded files safe and private?', a: 'Absolutely. All processing occurs in memory with zero permanent file storage. Your data never touches a database.' }
    ],
    relatedSlugs: ['png-to-jpg', 'image-compressor', 'image-resizer', 'png-to-webp', 'jpg-to-pdf']
  },

  {
    slug: 'png-to-jpg',
    type: 'image-convert',
    name: 'PNG to JPG Converter',
    h1: 'Convert PNG to JPG Online Free',
    badge: 'Ultra Compact',
    iconName: 'Image',
    fromFormat: 'png',
    toFormat: 'jpg',
    metaTitle: 'PNG to JPG Converter — Fast & Free Online Tool | Zyvokio',
    metaDescription: 'Convert PNG images to JPG online for free. Drastically reduce file size for web compatibility and easy email sharing with studio color reproduction.',
    keywords: ['png to jpg', 'convert png to jpg', 'png to jpeg', 'compress png to jpg', 'free png to jpg converter'],
    lead: 'Convert large PNG files into lightweight, universally compatible JPG images. Shrink file sizes by up to 80% while retaining brilliant photographic clarity.',
    howTo: [
      { step: 1, title: 'Upload PNG Files', desc: 'Select or drag your PNG images into the dropzone.' },
      { step: 2, title: 'Auto-Convert to JPG', desc: 'Our studio engine flattens transparency with a clean background and compresses efficiently.' },
      { step: 3, title: 'Save Lightweight JPG', desc: 'Download your optimized JPG files individually or bundled in a ZIP archive.' }
    ],
    features: [
      { title: 'Drastic File Size Reduction', desc: 'PNG files can be heavy. Converting to JPG cuts file size by up to 80% for faster website loading.' },
      { title: 'Universal Device Support', desc: 'JPG is supported by every operating system, browser, printer, and digital display.' },
      { title: 'High-Quality Chroma Subsampling', desc: 'Utilizes 4:4:4 color fidelity algorithms to avoid muddy edges or color bleeding.' },
      { title: 'No Account Required', desc: 'Instant browser access without entering an email or installing desktop software.' }
    ],
    infoSections: [
      {
        heading: 'When Should You Convert PNG to JPG?',
        text: 'PNG files are lossless and often contain uncompressed raster data, making them significantly larger than JPGs. If you need to upload product photos to an e-commerce platform, send images over email, or speed up page load times on your website, converting PNG to JPG is the quickest way to reduce weight without noticeable visual degradation.'
      }
    ],
    faqs: [
      { q: 'What happens to transparency when converting PNG to JPG?', a: 'Because JPG does not support transparent layers, transparent areas are automatically rendered with a clean, professional white background.' },
      { q: 'Does converting to JPG reduce file size?', a: 'Yes! Converting PNG to JPG typically reduces file size by 50% to 80%, making files much easier to store and share.' }
    ],
    relatedSlugs: ['jpg-to-png', 'image-compressor', 'image-resizer', 'webp-to-jpg', 'jpg-to-pdf']
  },

  {
    slug: 'png-to-webp',
    type: 'image-convert',
    name: 'PNG to WebP Converter',
    h1: 'Convert PNG to WebP Online',
    badge: 'Next-Gen Web Format',
    iconName: 'Sparkles',
    fromFormat: 'png',
    toFormat: 'webp',
    metaTitle: 'PNG to WebP Converter — Next-Gen Image Compression | Zyvokio',
    metaDescription: 'Convert PNG to WebP online for free. Boost Google Core Web Vitals and SEO with modern WebP images that are 30% smaller than PNG while keeping transparency.',
    keywords: ['png to webp', 'convert png to webp', 'next gen image format', 'webp converter', 'google web vitals image'],
    lead: 'Upgrade your PNG assets to Google-recommended WebP format. Retain full alpha transparency while saving up to 35% more bandwidth than standard PNGs.',
    howTo: [
      { step: 1, title: 'Upload PNG Graphic', desc: 'Drop transparent PNG logos, illustrations, or graphics into the workspace.' },
      { step: 2, title: 'Encode in Next-Gen WebP', desc: 'Sharp compresses predictive pixel data into modern WebP containers.' },
      { step: 3, title: 'Boost Page Speed', desc: 'Download your compact WebP image and enjoy faster website loading scores.' }
    ],
    features: [
      { title: 'Google SEO Performance Boost', desc: 'Google PageSpeed Insights directly recommends WebP for better Core Web Vitals ranking.' },
      { title: 'Preserves Full Alpha Transparency', desc: 'Unlike JPG, WebP keeps your transparent layers intact with even smoother edges.' },
      { title: '30-40% Smaller than PNG', desc: 'Dramatic bandwidth savings without perceptible quality degradation.' }
    ],
    infoSections: [
      {
        heading: 'Why WebP is the Future of Web Graphics',
        text: 'Developed by Google, WebP was engineered specifically for the modern web. It provides superior lossless and lossy compression compared to legacy PNG and JPG formats. Using WebP on your website directly improves Google PageSpeed scores, lowers bounce rates, and decreases mobile bandwidth usage.'
      }
    ],
    faqs: [
      { q: 'Do all modern browsers support WebP?', a: 'Yes! Over 97% of modern web browsers including Chrome, Safari, Firefox, Edge, and mobile browsers fully support WebP.' },
      { q: 'Does WebP support transparent backgrounds like PNG?', a: 'Yes! WebP provides complete 8-bit alpha channel transparency support just like PNG.' }
    ],
    relatedSlugs: ['jpg-to-png', 'webp-to-png', 'webp-to-jpg', 'image-compressor']
  },

  {
    slug: 'webp-to-jpg',
    type: 'image-convert',
    name: 'WebP to JPG Converter',
    h1: 'Convert WebP to JPG Online Free',
    badge: 'Universal Compatibility',
    iconName: 'Image',
    fromFormat: 'webp',
    toFormat: 'jpg',
    metaTitle: 'WebP to JPG Converter — Convert WebP Images Free | Zyvokio',
    metaDescription: 'Easily convert WebP images downloaded from websites into standard JPG format for easy viewing, editing in Photoshop, and universal device sharing.',
    keywords: ['webp to jpg', 'convert webp to jpg', 'webp to jpeg', 'open webp file', 'save webp as jpg'],
    lead: 'Struggling to open WebP files in older photo viewers or Photoshop? Convert WebP into universal JPG files in seconds with zero hassle.',
    howTo: [
      { step: 1, title: 'Upload WebP Image', desc: 'Drop any WebP file downloaded from the internet into the converter.' },
      { step: 2, title: 'Convert Instantly', desc: 'Our engine parses the WebP bitstream and renders a universal JPG.' },
      { step: 3, title: 'Download & Edit Anywhere', desc: 'Open your JPG in Photoshop, Microsoft Office, or any image viewer.' }
    ],
    features: [
      { title: 'Edit in Any Software', desc: 'Easily import images into Photoshop, InDesign, Word, or legacy editors.' },
      { title: 'Universal Sharing', desc: 'Send via WhatsApp, AirDrop, or email with 100% viewing compatibility.' }
    ],
    infoSections: [
      {
        heading: 'Why Convert WebP to JPG?',
        text: 'When you save pictures from modern websites, they frequently download with a .webp extension. Many image editors, printers, and older devices cannot open WebP files natively. Converting them back to JPG guarantees you can view, edit, print, and share them anywhere without compatibility headaches.'
      }
    ],
    faqs: [
      { q: 'Why do images save as WebP when downloading from Google?', a: 'Modern websites use WebP to speed up loading times. Our tool converts those files back to standard JPG so you can edit and view them anywhere.' }
    ],
    relatedSlugs: ['webp-to-png', 'jpg-to-png', 'image-compressor', 'jpg-to-pdf']
  },

  {
    slug: 'webp-to-png',
    type: 'image-convert',
    name: 'WebP to PNG Converter',
    h1: 'Convert WebP to PNG Online Free',
    badge: 'Lossless Quality',
    iconName: 'Image',
    fromFormat: 'webp',
    toFormat: 'png',
    metaTitle: 'WebP to PNG Converter — Transparent & Lossless | Zyvokio',
    metaDescription: 'Convert WebP to PNG online while keeping transparent backgrounds intact. High-resolution conversion with no quality loss and zero installation.',
    keywords: ['webp to png', 'convert webp to png', 'webp transparent to png', 'extract webp to png'],
    lead: 'Convert WebP images to high-resolution PNG format. Retain full transparency and unpack next-gen graphics into editable raster assets.',
    howTo: [
      { step: 1, title: 'Upload WebP', desc: 'Select your WebP files with or without transparent backgrounds.' },
      { step: 2, title: 'Render PNG', desc: 'Lossless raster conversion guarantees pixel-perfect fidelity.' },
      { step: 3, title: 'Download Asset', desc: 'Save pristine PNG images ready for Canva, Figma, and photo editors.' }
    ],
    features: [
      { title: 'Preserves Transparent Layers', desc: 'Transparent WebP images translate into clean alpha-channel PNGs.' },
      { title: 'Ideal for Graphic Designers', desc: 'Import effortlessly into Figma, Adobe Illustrator, and Canva.' }
    ],
    infoSections: [
      {
        heading: 'Maintain Transparency with WebP to PNG',
        text: 'When you have a WebP logo or sticker with a transparent background that needs to be used in design software, converting to PNG ensures that the transparency mask is preserved without white borders or artifacts.'
      }
    ],
    faqs: [
      { q: 'Will transparent WebP stay transparent in PNG?', a: 'Yes! Zyvokio fully transfers the alpha transparency channel directly into the resulting PNG.' }
    ],
    relatedSlugs: ['jpg-to-png', 'webp-to-jpg', 'image-resizer', 'image-compressor']
  },

  {
    slug: 'svg-to-png',
    type: 'image-convert',
    name: 'SVG to PNG Converter',
    h1: 'Convert SVG to High-Resolution PNG',
    badge: 'Vector to Raster',
    iconName: 'Sparkles',
    fromFormat: 'svg',
    toFormat: 'png',
    metaTitle: 'SVG to PNG Converter — Rasterize Vectors Online | Zyvokio',
    metaDescription: 'Convert SVG vector graphics to crisp, high-resolution PNG images with transparent backgrounds. Fast, free, and studio-grade vector rasterization.',
    keywords: ['svg to png', 'convert svg to png', 'vector to png', 'rasterize svg', 'svg to transparent png'],
    lead: 'Render Scalable Vector Graphics (SVG) into crisp, high-density transparent PNG files suitable for websites, presentations, and social media.',
    howTo: [
      { step: 1, title: 'Select SVG Vector', desc: 'Upload .svg files containing vectors, icons, or vector typography.' },
      { step: 2, title: 'High-Density Rasterization', desc: 'Our vector engine renders vector paths into crisp raster pixels.' },
      { step: 3, title: 'Download PNG', desc: 'Get your high-DPI transparent PNG graphic instantly.' }
    ],
    features: [
      { title: 'Pixel-Sharp Edges', desc: 'Sub-pixel vector rendering ensures zero blurriness or raster distortion.' },
      { title: 'Complete Background Transparency', desc: 'Exports without unwanted background fills.' }
    ],
    infoSections: [
      {
        heading: 'Why Rasterize SVG to PNG?',
        text: 'SVG vectors are fantastic for scalability, but many social platforms, email clients, and software (like Microsoft Word or PowerPoint) do not support inline SVG embedding. Converting to PNG gives you a universally readable image that displays consistently across all screens.'
      }
    ],
    faqs: [
      { q: 'Can I upload complex SVG illustrations?', a: 'Yes, our engine handles layered vectors, gradients, and custom paths with ease.' }
    ],
    relatedSlugs: ['jpg-to-png', 'png-to-webp', 'image-resizer']
  },

  // ==========================================
  // 2. DEDICATED IMAGE UTILITIES
  // ==========================================
  {
    slug: 'image-compressor',
    type: 'image-compress',
    name: 'Image Compressor',
    h1: 'Compress Images Online Free (JPG, PNG, WebP)',
    badge: 'Smart Compression',
    iconName: 'Minimize2',
    metaTitle: 'Free Image Compressor — Reduce JPG, PNG & WebP File Size | Zyvokio',
    metaDescription: 'Compress images online for free. Reduce file size of JPG, PNG, and WebP by up to 85% without losing visible quality. Fast, private, in-browser compression.',
    keywords: ['image compressor', 'compress image', 'reduce image size', 'compress jpg', 'compress png', 'shrink photo size free'],
    lead: 'Drastically reduce image file sizes while preserving sharp details and vibrant colors. Optimize your pictures for faster web loading, email attachments, and storage savings.',
    howTo: [
      { step: 1, title: 'Select Images', desc: 'Upload one or multiple JPG, PNG, or WebP files from your device.' },
      { step: 2, title: 'Adjust Compression Level', desc: 'Choose your desired quality level using our interactive slider (70% - 85% recommended).' },
      { step: 3, title: 'Download Compressed Files', desc: 'See your exact file size savings in real-time and download your optimized images.' }
    ],
    features: [
      { title: 'Up to 85% File Size Reduction', desc: 'Smart quantization algorithms strip redundant metadata and optimize pixel distribution.' },
      { title: 'Zero Quality Loss to Human Eye', desc: 'Perceptual compression keeps photos crystal clear while drastically cutting kilobyte weight.' },
      { title: 'Batch Compress Multiple Photos', desc: 'Compress dozens of images in seconds with simultaneous batch optimization.' },
      { title: '100% Private & In-Memory', desc: 'No images are saved or transmitted to third-party databases. Complete data privacy.' }
    ],
    infoSections: [
      {
        heading: 'How Image Compression Speeds Up Websites & SEO',
        text: 'Uncompressed images are the #1 cause of slow websites. Heavy photos increase page load time, hurt user experience, and drag down your Google search rankings. By using Zyvokio Image Compressor, you can cut image weight by 70% to 85%, speeding up your site dramatically and boosting Core Web Vitals scores.'
      },
      {
        heading: 'Lossless vs Lossy Image Compression',
        text: 'Lossless compression reduces file size by organizing image data more efficiently without removing any pixels. Lossy compression gently removes imperceptible color data to achieve massive file size drops. Zyvokio provides an interactive quality slider so you have 100% control over the balance between file size and visual fidelity.'
      }
    ],
    faqs: [
      { q: 'What image formats can I compress?', a: 'You can compress JPG, JPEG, PNG, and WebP images quickly and easily.' },
      { q: 'Will compressing my photo make it look blurry?', a: 'No! At recommended settings (70%-80%), the compression is virtually indistinguishable from the original image to the human eye.' },
      { q: 'Is there a limit on how many images I can compress?', a: 'No, Zyvokio is 100% free with unlimited compressions and zero daily caps.' }
    ],
    relatedSlugs: ['image-resizer', 'jpg-to-png', 'png-to-jpg', 'png-to-webp', 'compress-pdf']
  },

  {
    slug: 'image-resizer',
    type: 'image-resizer',
    name: 'Image Resizer',
    h1: 'Resize Image Dimensions Online Free',
    badge: 'Exact Dimensions',
    iconName: 'Crop',
    metaTitle: 'Free Image Resizer — Resize JPG, PNG, WebP Online | Zyvokio',
    metaDescription: 'Resize image dimensions in pixels or percentage online for free. Keep aspect ratio locked, crop or scale images for YouTube, Instagram, passports, and web.',
    keywords: ['image resizer', 'resize image', 'resize photo', 'change image dimensions', 'resize image in pixels', 'free photo resizer'],
    lead: 'Resize your images to exact pixel dimensions (width & height) or percentage scale. Lock aspect ratios to prevent image stretching and export with studio clarity.',
    howTo: [
      { step: 1, title: 'Upload Image', desc: 'Drag and drop your photo or graphic into the resizer workspace.' },
      { step: 2, title: 'Set Width & Height', desc: 'Enter custom pixels or select quick scale presets (25%, 50%, 75%, 150%, 200%).' },
      { step: 3, title: 'Export Resized Image', desc: 'Download your perfectly scaled image in JPG, PNG, or WebP format instantly.' }
    ],
    features: [
      { title: 'Aspect Ratio Lock', desc: 'Prevents image distortion and stretching by automatically recalculating dimensions.' },
      { title: 'Preset Scaling Percentages', desc: 'Scale down 50% for email or scale up 200% for high-DPI displays with one click.' },
      { title: 'Multi-Format Export', desc: 'Save your resized output in JPG, PNG, or modern WebP format.' },
      { title: 'Social Media & Passport Sizing', desc: 'Perfect for YouTube thumbnails, Instagram posts, banners, and passport photos.' }
    ],
    infoSections: [
      {
        heading: 'Why Resize Images Before Uploading?',
        text: 'Uploading a raw 4000x3000px photo to a website or social profile that only displays at 800x600px wastes bandwidth and slows down display performance. Resizing your image to the exact container dimensions ensures instant loading, optimal crispness, and prevents awkward cropping.'
      }
    ],
    faqs: [
      { q: 'How do I prevent my image from stretching?', a: 'Keep the "Maintain Aspect Ratio" checkbox checked. When you change width, height will automatically update to keep natural proportions.' },
      { q: 'Can I resize images for passport or visa applications?', a: 'Yes! Simply type in the required pixel dimensions (e.g. 600x600 px for US passport photos).' }
    ],
    relatedSlugs: ['image-compressor', 'jpg-to-png', 'png-to-jpg', 'crop-pdf']
  },

  // ==========================================
  // 3. KEY PDF TOOLS
  // ==========================================
  {
    slug: 'pdf-to-jpg',
    type: 'pdf-tool',
    pdfToolId: 'pdf-to-jpg',
    name: 'PDF to JPG Converter',
    h1: 'Convert PDF to JPG Online Free',
    badge: 'High Resolution',
    iconName: 'Images',
    metaTitle: 'PDF to JPG Converter — Extract PDF Pages to Images | Zyvokio',
    metaDescription: 'Convert PDF pages to high-quality JPG images online for free. Extract every page into separate high-resolution photos or download as a ZIP archive.',
    keywords: ['pdf to jpg', 'convert pdf to jpg', 'extract images from pdf', 'pdf to image converter', 'pdf to jpeg online'],
    lead: 'Turn PDF documents into high-resolution JPG images. Extract single pages or batch convert multi-page documents with crisp typography and clean graphics.',
    howTo: [
      { step: 1, title: 'Upload PDF Document', desc: 'Select or drag your PDF file into the PDF to JPG converter.' },
      { step: 2, title: 'Render High-DPI Pages', desc: 'Our PDF engine parses each vector page and renders crystal-clear 300 DPI images.' },
      { step: 3, title: 'Download JPG Images', desc: 'Save pages individually or download all converted pages in a single ZIP file.' }
    ],
    features: [
      { title: 'High-DPI Rendering', desc: 'Crisp font rendering and sharp graphic extraction at print-ready resolutions.' },
      { title: 'Multi-Page Extraction', desc: 'Converts documents with hundreds of pages into sequential high-res images.' },
      { title: 'ZIP Archive Download', desc: 'Download all extracted pages conveniently packed in a single ZIP folder.' },
      { title: '100% In-Browser Privacy', desc: 'Your confidential PDF pages are rendered locally and never uploaded to public clouds.' }
    ],
    infoSections: [
      {
        heading: 'Why Convert PDF Pages to JPG?',
        text: 'PDFs are great for documents, but they cannot be directly embedded in social media posts, image sliders, or photo editors. Converting PDF pages to JPG allows you to share presentation slides, certificates, and invoices as visual images across Instagram, LinkedIn, and messaging apps.'
      }
    ],
    faqs: [
      { q: 'Can I convert a password-protected PDF to JPG?', a: 'You can first use our "Unlock PDF" tool to remove the password, and then convert to JPG easily.' },
      { q: 'Are all pages converted or just the first page?', a: 'Every single page of your PDF document is converted into its own individual high-resolution JPG image.' }
    ],
    relatedSlugs: ['jpg-to-pdf', 'merge-pdf', 'compress-pdf', 'image-compressor', 'split-pdf']
  },

  {
    slug: 'jpg-to-pdf',
    type: 'pdf-tool',
    pdfToolId: 'jpg-to-pdf',
    name: 'JPG to PDF Converter',
    h1: 'Convert JPG to PDF Online Free',
    badge: 'Multi-Image Merge',
    iconName: 'FileUp',
    metaTitle: 'JPG to PDF Converter — Combine Images into PDF | Zyvokio',
    metaDescription: 'Convert JPG, PNG, and photos to PDF online for free. Combine multiple images into a single professional PDF document with custom margins and orientation.',
    keywords: ['jpg to pdf', 'convert jpg to pdf', 'images to pdf', 'combine photos into pdf', 'photo to pdf converter free'],
    lead: 'Combine multiple JPG, PNG, and photo files into a single, clean PDF document. Reorder pages, set page orientation, and download in seconds.',
    howTo: [
      { step: 1, title: 'Upload Photos', desc: 'Select one or more JPG, JPEG, or PNG images in any order.' },
      { step: 2, title: 'Configure & Reorder', desc: 'Arrange image order and choose orientation (portrait or landscape).' },
      { step: 3, title: 'Generate PDF', desc: 'Download your unified, high-quality PDF document immediately.' }
    ],
    features: [
      { title: 'Combine Multiple Images', desc: 'Merge dozens of photos into one organized multi-page document.' },
      { title: 'Clean Margin Controls', desc: 'Set margins or fit pictures edge-to-edge for print-ready PDFs.' },
      { title: 'Preserves Original Quality', desc: 'Images are placed into PDF containers without blurring or degradation.' }
    ],
    infoSections: [
      {
        heading: 'Create Professional PDFs from Photos',
        text: 'Whether you are submitting scanned receipts, homework assignments, identity proofs, or photo portfolios, combining loose image files into a single structured PDF is the most professional way to share documents.'
      }
    ],
    faqs: [
      { q: 'Can I add multiple images in a specific order?', a: 'Yes! You can upload multiple files and arrange them in the exact order you want them to appear in the PDF.' }
    ],
    relatedSlugs: ['pdf-to-jpg', 'merge-pdf', 'compress-pdf', 'jpg-to-png']
  },

  {
    slug: 'merge-pdf',
    type: 'pdf-tool',
    pdfToolId: 'merge-pdf',
    name: 'Merge PDF',
    h1: 'Merge PDF Files Online Free',
    badge: 'Top PDF Tool',
    iconName: 'Layers',
    metaTitle: 'Merge PDF Online — Combine Multiple PDFs into One | Zyvokio',
    metaDescription: 'Merge PDF files online for free. Combine multiple PDF documents into a single organized file in any sequence you choose. Fast, secure, and private.',
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'merge pdf online free', 'pdf merger'],
    lead: 'Combine multiple PDF files into a single unified document. Drag and drop to reorder pages and merge documents with zero loss of formatting.',
    howTo: [
      { step: 1, title: 'Add PDF Documents', desc: 'Upload two or more PDF files you want to combine.' },
      { step: 2, title: 'Arrange Order', desc: 'Drag files into the exact sequence you desire.' },
      { step: 3, title: 'Download Combined PDF', desc: 'Click Merge to generate and download your unified document.' }
    ],
    features: [
      { title: 'Preserves Bookmarks & Links', desc: 'Retains embedded hyperlinks, table of contents, and document bookmarks.' },
      { title: 'Unlimited File Count', desc: 'Merge as many documents as needed with no artificial limits.' }
    ],
    infoSections: [
      {
        heading: 'Why Merge PDF Documents?',
        text: 'Managing multiple separate PDF attachments can be chaotic for clients and colleagues. Merging them into a single file creates a seamless, easy-to-read document that is simple to archive, print, and distribute.'
      }
    ],
    faqs: [
      { q: 'Is there a limit on how many PDFs I can merge?', a: 'No, you can combine multiple PDF documents in one session completely free.' }
    ],
    relatedSlugs: ['split-pdf', 'compress-pdf', 'remove-pages', 'pdf-to-jpg']
  },

  {
    slug: 'compress-pdf',
    type: 'pdf-tool',
    pdfToolId: 'compress-pdf',
    name: 'Compress PDF',
    h1: 'Compress PDF File Size Online',
    badge: 'Essential Tool',
    iconName: 'Minimize2',
    metaTitle: 'Compress PDF Online — Reduce PDF File Size Free | Zyvokio',
    metaDescription: 'Compress PDF online to reduce file size without losing quality. Optimize documents for email attachments and portal uploads. 100% free and secure.',
    keywords: ['compress pdf', 'reduce pdf file size', 'shrink pdf', 'compress pdf online free', 'optimize pdf'],
    lead: 'Reduce heavy PDF file sizes drastically while maintaining crisp text and sharp visuals. Perfect for email attachments and portal upload limits.',
    howTo: [
      { step: 1, title: 'Upload Large PDF', desc: 'Select the heavy PDF document you need to shrink.' },
      { step: 2, title: 'Smart Stream Compression', desc: 'Our engine cleans unreferenced objects, flattens streams, and compresses raster assets.' },
      { step: 3, title: 'Download Lightweight PDF', desc: 'Save your optimized PDF ready for email and web uploading.' }
    ],
    features: [
      { title: 'Email Attachment Friendly', desc: 'Easily get your PDF under 10MB or 25MB email attachment caps.' },
      { title: 'Sharp Text & Vectors', desc: 'Compresses images while keeping fonts and vector lines crystal clear.' }
    ],
    infoSections: [
      {
        heading: 'Overcoming Portal Upload Limits with PDF Compression',
        text: 'Government portals, job application boards, and university upload systems strictly cap PDF file sizes (often at 2MB or 5MB). Zyvokio PDF Compressor optimizes the internal structure and streams to shrink file size dramatically without making text unreadable.'
      }
    ],
    faqs: [
      { q: 'Will compressing my PDF make the text blurry?', a: 'No, PDF text is stored as vector outlines, so text remains razor-sharp regardless of file size reduction.' }
    ],
    relatedSlugs: ['merge-pdf', 'split-pdf', 'pdf-to-jpg', 'image-compressor']
  },

  {
    slug: 'split-pdf',
    type: 'pdf-tool',
    pdfToolId: 'split-pdf',
    name: 'Split PDF',
    h1: 'Split PDF Pages Online Free',
    badge: 'Page Extractor',
    iconName: 'Scissors',
    metaTitle: 'Split PDF Online — Separate & Extract PDF Pages | Zyvokio',
    metaDescription: 'Split PDF online for free. Extract specific pages or divide a multi-page document into independent PDF files with custom page ranges.',
    keywords: ['split pdf', 'extract pages from pdf', 'separate pdf', 'split pdf online free', 'cut pdf pages'],
    lead: 'Separate single pages or entire page ranges from your PDF. Extract only the sections you need into clean, standalone PDF files.',
    howTo: [
      { step: 1, title: 'Upload PDF', desc: 'Drop the PDF file you wish to split or extract from.' },
      { step: 2, title: 'Choose Page Range', desc: 'Specify exact page numbers (e.g. 1-3, 5, 8-10).' },
      { step: 3, title: 'Download Split Document', desc: 'Instantly download your extracted pages as a new PDF.' }
    ],
    features: [
      { title: 'Flexible Page Ranges', desc: 'Extract custom intervals like "1-5, 8, 12-15" with pinpoint accuracy.' },
      { title: 'Zero Quality Loss', desc: 'Original fonts, vector graphics, and forms are kept perfectly intact.' }
    ],
    infoSections: [
      {
        heading: 'Extract Only What You Need',
        text: 'Need to share only the invoice from a 50-page financial statement, or chapter 3 from a long book? Splitting the PDF lets you send exactly the relevant pages while keeping private or irrelevant information confidential.'
      }
    ],
    faqs: [
      { q: 'Can I extract non-consecutive pages?', a: 'Yes! You can specify ranges such as "1, 3, 5-7" to extract specific individual pages.' }
    ],
    relatedSlugs: ['merge-pdf', 'remove-pages', 'compress-pdf', 'rotate-pdf']
  },

  {
    slug: 'word-to-pdf',
    type: 'pdf-tool',
    pdfToolId: 'word-to-pdf',
    name: 'Word to PDF Converter',
    h1: 'Convert Word to PDF Online Free',
    badge: 'Office Suite',
    iconName: 'FileText',
    metaTitle: 'Word to PDF Converter — Convert DOCX to PDF Online | Zyvokio',
    metaDescription: 'Convert Word documents (DOC and DOCX) into clean, printable PDF files online for free. Locks typography, layout, and formatting universally.',
    keywords: ['word to pdf', 'convert word to pdf', 'docx to pdf', 'doc to pdf online free', 'word converter'],
    lead: 'Lock formatting, fonts, and page layouts by converting DOC and DOCX Word documents into professional, universally readable PDF files.',
    howTo: [
      { step: 1, title: 'Select Word Document', desc: 'Upload your .docx or .doc file.' },
      { step: 2, title: 'Format & Convert', desc: 'Our engine generates a PDF preserving margins and text hierarchy.' },
      { step: 3, title: 'Download PDF', desc: 'Save your polished PDF ready to share and print.' }
    ],
    features: [
      { title: 'Preserves Layout Integrity', desc: 'Prevents font shifts, line reflows, and misplaced margins across different devices.' },
      { title: 'Instant Conversion', desc: 'No Microsoft Office installation or account required.' }
    ],
    infoSections: [
      {
        heading: 'Why Convert Word to PDF?',
        text: 'When you send a Word document, if the recipient lacks your specific fonts or uses a different version of Office, the layout can easily break. Converting to PDF permanently locks typography, tables, and spacing so every viewer sees the document exactly as you designed it.'
      }
    ],
    faqs: [
      { q: 'Will my formatting change when converting to PDF?', a: 'No, the conversion locks your formatting so the PDF matches your document layout.' }
    ],
    relatedSlugs: ['pdf-to-word', 'excel-to-pdf', 'powerpoint-to-pdf', 'merge-pdf']
  },

  {
    slug: 'pdf-to-word',
    type: 'pdf-tool',
    pdfToolId: 'pdf-to-word',
    name: 'PDF to Word Converter',
    h1: 'Convert PDF to Word DOCX Online',
    badge: 'Editable Document',
    iconName: 'FileEdit',
    metaTitle: 'PDF to Word Converter — Convert PDF to Editable DOCX | Zyvokio',
    metaDescription: 'Convert PDF files into editable Microsoft Word DOCX documents online for free. Retain text, paragraphs, and tables for effortless editing.',
    keywords: ['pdf to word', 'convert pdf to word', 'pdf to docx', 'edit pdf in word', 'pdf to doc free'],
    lead: 'Need to edit text trapped inside a PDF? Convert your PDF documents into editable Word DOCX files with preserved text flow and tables.',
    howTo: [
      { step: 1, title: 'Upload PDF', desc: 'Drop the PDF document you need to edit.' },
      { step: 2, title: 'Extract Text & Layout', desc: 'Our engine structures content into Word paragraphs and headings.' },
      { step: 3, title: 'Edit in Word', desc: 'Download your DOCX file and start editing immediately in Word or Google Docs.' }
    ],
    features: [
      { title: 'Fully Editable Text', desc: 'Edit paragraphs, change fonts, and update numbers effortlessly.' },
      { title: 'Compatible with Google Docs', desc: 'Opens cleanly in Word, Office 365, LibreOffice, and Google Docs.' }
    ],
    infoSections: [
      {
        heading: 'Unlock Trapped Text in PDFs',
        text: 'Instead of retyping whole contracts, resumes, or reports from scratch, converting to Word DOCX gives you an editable document with text and structural formatting ready for instant modification.'
      }
    ],
    faqs: [
      { q: 'Can I edit the converted file in Microsoft Word?', a: 'Yes! The downloaded file is a standard .docx format that works in Microsoft Word, Google Docs, and Pages.' }
    ],
    relatedSlugs: ['word-to-pdf', 'pdf-to-jpg', 'pdf-to-excel', 'edit-pdf']
  },

  {
    slug: 'protect-pdf',
    type: 'pdf-tool',
    pdfToolId: 'protect-pdf',
    name: 'Protect PDF',
    h1: 'Encrypt & Password Protect PDF Online',
    badge: 'AES-256 Security',
    iconName: 'Lock',
    metaTitle: 'Password Protect PDF — Encrypt PDF Online Free | Zyvokio',
    metaDescription: 'Protect PDF files with strong AES-256 encryption and a secure password. Prevent unauthorized reading, copying, and printing of sensitive documents.',
    keywords: ['protect pdf', 'password protect pdf', 'encrypt pdf', 'lock pdf', 'secure pdf online'],
    lead: 'Secure confidential documents with military-grade AES encryption. Require a custom password to open and view sensitive financial, legal, or personal records.',
    howTo: [
      { step: 1, title: 'Select PDF', desc: 'Choose the document you want to password protect.' },
      { step: 2, title: 'Set Secure Password', desc: 'Enter and confirm your chosen encryption password.' },
      { step: 3, title: 'Download Locked PDF', desc: 'Save your encrypted file. A password is now required to open it.' }
    ],
    features: [
      { title: 'Strong Encryption', desc: 'Prevents unauthorized viewing and restricts document tampering.' },
      { title: 'Client-Side Processing', desc: 'Passwords and sensitive data never leave your browser.' }
    ],
    infoSections: [
      {
        heading: 'Why Encrypt Confidential PDFs?',
        text: 'Contracts, tax records, medical documents, and banking papers contain sensitive personal data. Adding password encryption ensures that even if an email is intercepted or forwarded, unauthorized individuals cannot read your files.'
      }
    ],
    faqs: [
      { q: 'Can anyone open the file without the password?', a: 'No, once encrypted, the document cannot be viewed in any PDF reader without entering the exact password.' }
    ],
    relatedSlugs: ['unlock-pdf', 'sign-pdf', 'redact-pdf', 'compress-pdf']
  },

  {
    slug: 'unlock-pdf',
    type: 'pdf-tool',
    pdfToolId: 'unlock-pdf',
    name: 'Unlock PDF',
    h1: 'Remove Password from PDF Online',
    badge: 'Decryption',
    iconName: 'Unlock',
    metaTitle: 'Unlock PDF — Remove PDF Password & Restrictions Free | Zyvokio',
    metaDescription: 'Remove passwords and printing or editing restrictions from secured PDF documents online for free. Save an unlocked, accessible copy instantly.',
    keywords: ['unlock pdf', 'remove pdf password', 'decrypt pdf', 'unprotect pdf', 'remove restrictions from pdf'],
    lead: 'Tired of typing a password every time you open a PDF? Unlock your secured document and save a permanently unrestricted copy for quick reading and printing.',
    howTo: [
      { step: 1, title: 'Upload Locked PDF', desc: 'Select your password-protected PDF.' },
      { step: 2, title: 'Provide Password', desc: 'Enter the valid password to authorize decryption.' },
      { step: 3, title: 'Download Unlocked File', desc: 'Save a clean PDF that opens instantly with zero password prompts.' }
    ],
    features: [
      { title: 'Permanent Decryption', desc: 'Removes the password prompt for seamless everyday access.' },
      { title: 'Restores Print & Copy Rights', desc: 'Enables text selection, printing, and annotation permissions.' }
    ],
    infoSections: [
      {
        heading: 'Save Time on Frequently Used Documents',
        text: 'Bank statements, payslips, and insurance policies often come locked with passwords. Decrypting a personal archive copy allows you to search, print, and view your files immediately without remembering complex passwords.'
      }
    ],
    faqs: [
      { q: 'Do I need to know the original password?', a: 'Yes, you must know the password to authorize safe decryption and remove the lock.' }
    ],
    relatedSlugs: ['protect-pdf', 'sign-pdf', 'pdf-to-jpg', 'merge-pdf']
  },

  {
    slug: 'sign-pdf',
    type: 'pdf-tool',
    pdfToolId: 'sign-pdf',
    name: 'Sign PDF',
    h1: 'Sign PDF Online with Digital Signature',
    badge: 'e-Signature',
    iconName: 'PenTool',
    metaTitle: 'Sign PDF Online Free — Add Electronic Signature | Zyvokio',
    metaDescription: 'Sign PDF documents online for free. Draw your digital signature with mouse or stylus, or upload a signature image and stamp it anywhere on your PDF.',
    keywords: ['sign pdf', 'e-sign pdf', 'digital signature pdf', 'sign document online free', 'electronic signature'],
    lead: 'Draw your digital signature or upload an autograph image and stamp it onto contracts, agreements, and forms. 100% free with no sign-up needed.',
    howTo: [
      { step: 1, title: 'Upload Contract or PDF', desc: 'Open the document requiring your signature.' },
      { step: 2, title: 'Draw or Upload Signature', desc: 'Use our smooth signature pad to sign with mouse or finger.' },
      { step: 3, title: 'Stamp & Download', desc: 'Place signature on any page and download the finalized signed PDF.' }
    ],
    features: [
      { title: 'Smooth Ink Canvas', desc: 'Natural pen smoothing captures fluid, authentic signatures.' },
      { title: 'Custom Signature Colors', desc: 'Choose black, navy blue, or custom ink color.' },
      { title: 'Legally Binding E-Signatures', desc: 'Compliant with ESIGN and UETA standards for electronic agreements.' }
    ],
    infoSections: [
      {
        heading: 'No Printer or Scanner Required',
        text: 'Forget the outdated cycle of printing a PDF, signing it with a pen, scanning it back, and emailing it. Zyvokio lets you sign documents right inside your browser in under 30 seconds.'
      }
    ],
    faqs: [
      { q: 'Can I draw my signature on my phone or tablet?', a: 'Yes! Our signature pad is fully touch-compatible for fingers, Apple Pencil, and styluses.' }
    ],
    relatedSlugs: ['edit-pdf', 'protect-pdf', 'watermark-pdf', 'merge-pdf']
  },

  {
    slug: 'rotate-pdf',
    type: 'pdf-tool',
    pdfToolId: 'rotate-pdf',
    name: 'Rotate PDF',
    h1: 'Rotate PDF Pages Online Free',
    badge: 'Quick Edit',
    iconName: 'RotateCw',
    metaTitle: 'Rotate PDF Online — Permanently Rotate PDF Pages | Zyvokio',
    metaDescription: 'Rotate PDF pages permanently online for free. Turn upside-down or sideways pages 90°, 180°, or 270° degrees and download a corrected PDF document.',
    keywords: ['rotate pdf', 'turn pdf pages', 'rotate pdf online free', 'flip pdf orientation', 'fix upside down pdf'],
    lead: 'Fix scanned pages that were captured upside-down or sideways. Rotate single pages or all pages 90°, 180°, or 270° and save permanently.',
    howTo: [
      { step: 1, title: 'Upload Scanned PDF', desc: 'Select the document with incorrect page orientation.' },
      { step: 2, title: 'Rotate 90°, 180°, or 270°', desc: 'Click rotate to reorient pages correctly.' },
      { step: 3, title: 'Download Fixed PDF', desc: 'Save your upright, easy-to-read document.' }
    ],
    features: [
      { title: 'Permanent Rotation', desc: 'Locks orientation so the document opens right-side up on all devices.' },
      { title: 'Instant Preview', desc: 'Visual confirmation of rotation angles before saving.' }
    ],
    infoSections: [
      {
        heading: 'Fix Scanned Orientation Issues',
        text: 'Document scanners often feed landscape papers sideways or upside down. Rotating them permanently ensures reviewers can read your reports without straining or having to manually rotate in their viewer.'
      }
    ],
    faqs: [
      { q: 'Does rotating affect document quality?', a: 'No, rotating adjusts the internal display matrix without re-encoding or degrading the document content.' }
    ],
    relatedSlugs: ['split-pdf', 'merge-pdf', 'crop-pdf', 'remove-pages']
  }
];

/**
 * Helper to get a tool by slug
 */
export function getSeoToolBySlug(slug) {
  if (!slug) return null;
  const cleanSlug = slug.replace(/^\/+|\/+$/g, '').toLowerCase();
  return SEO_TOOLS.find(t => t.slug === cleanSlug) || null;
}

/**
 * Check if a path is a recognized SEO tool page
 */
export function isSeoToolPath(pathname) {
  if (!pathname) return false;
  const slug = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  return Boolean(SEO_TOOLS.some(t => t.slug === slug));
}
