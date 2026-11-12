# Franka Emika Panda model

`static/machines/panda.glb` is built by `scripts/build-panda.mjs` from the
Franka Emika Panda description in MuJoCo Menagerie
(https://github.com/google-deepmind/mujoco_menagerie/tree/main/franka_emika_panda),
which is derived from Franka Emika's publicly available robot description
(https://github.com/frankaemika/franka_ros).

Changes made here: the visual meshes were merged per link, simplified,
recoloured and compressed into a single glTF file.

Licensed under the Apache License, Version 2.0. You may obtain a copy of the
license at http://www.apache.org/licenses/LICENSE-2.0

Copyright belongs to the authors of those two repositories.
