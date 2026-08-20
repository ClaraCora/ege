# ege

This repository mirrors the URLs listed in `kelee.lsr`, `png.lsr`, `ad.lsr`,
`mihomo.lsr`, and `geo.lsr`.

The backup runs automatically every 12 hours and can also be started from the
Actions tab. Downloads use the following Loon request user agent:

```text
Loon/975 CFNetwork/3860.700.1 Darwin/25.6.0
```

Generated files are stored in `kelee/`, `png/`, `ad/`, `mihomo/`, and `geo/`.
Kelee rules are also converted into Mihomo-compatible providers under
`mihomo/domain/`, `mihomo/ipcidr/`, and `mihomo/classical/`. Rules that Mihomo
cannot represent, including `USER-AGENT`, are kept as audit reports under
`mihomo/unsupported/` and are not enabled automatically.

The local Mihomo configuration uses the converted Kelee providers where the
same category was already present, while unrelated existing providers remain
unchanged.
