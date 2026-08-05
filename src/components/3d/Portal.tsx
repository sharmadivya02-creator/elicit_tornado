const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);

    const verticalSpan = 10;
    const helixTurns = 3.5;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const baseZ = -Math.random() * TUNNEL_DEPTH;

      const t = Math.random();
      const y = (t - 0.5) * verticalSpan;
      const angle = t * helixTurns * Math.PI * 2 + Math.random() * 0.4;

      const radius = 2.2 + Math.random() * 1.8;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = baseZ + Math.sin(angle) * radius * 0.3;

      seeds[i] = Math.random();
    }

    return { positions, seeds };
  }, []);