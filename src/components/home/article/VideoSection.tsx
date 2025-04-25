
import React from 'react';

const VideoSection = () => {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Understanding Modern Trading Challenges</h2>
      <div className="aspect-video w-full mb-8">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/8Brhe2-FnnA"
          title="Understanding Modern Trading Challenges"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-xl"
        ></iframe>
      </div>
    </section>
  );
};

export default VideoSection;
