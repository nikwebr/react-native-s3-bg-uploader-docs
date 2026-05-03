export function MotivationSection() {
  return (
    <section id="motivation" className="pt-5 pb-24 px-6 bg-card/50">
      <div className="mt-16 max-w-2xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-primary font-medium mb-3">Why we built this</p>
          <p className="text-muted-foreground leading-relaxed">
            We built this library for the redesign of{" "}
            <a className="text-foreground font-medium" href="https://ysendit.com">ysendit</a>, our own file sharing service.
            We needed uploads that survive backgrounding, app restarts, and flaky connections — reliably,
            on every platform. No existing library checked all the boxes, so we wrote one in Rust,
            open-sourced it, and continuously improve it.
          </p>
          <p className="pt-5">
            If you are also a file uploading enthusiast, we are very open for your contribution to this project!
          </p>
        </div>
    </section>
  )
}