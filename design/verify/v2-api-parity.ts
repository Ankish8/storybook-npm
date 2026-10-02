import type { BadgeProps as BadgeV1 } from "../../src/components/ui/badge";
import type { BadgeProps as BadgeV2 } from "../../src/components/ui/v2/badge";
import type {
  TagProps as TagV1,
  TagGroupProps as TagGroupV1,
} from "../../src/components/ui/tag";
import type {
  TagProps as TagV2,
  TagGroupProps as TagGroupV2,
} from "../../src/components/ui/v2/tag";
import type { InputProps as InputV1 } from "../../src/components/ui/input";
import type { InputProps as InputV2 } from "../../src/components/ui/v2/input";
import type {
  CheckboxProps as CheckboxV1,
  CheckedState as CheckedStateV1,
} from "../../src/components/ui/checkbox";
import type {
  CheckboxProps as CheckboxV2,
  CheckedState as CheckedStateV2,
} from "../../src/components/ui/v2/checkbox";
import type { SwitchProps as SwitchV1 } from "../../src/components/ui/switch";
import type { SwitchProps as SwitchV2 } from "../../src/components/ui/v2/switch";

type Same<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Assert<T extends true> = T;
export type BatchOneApiParity = [
  Assert<Same<BadgeV1, BadgeV2>>,
  Assert<Same<TagV1, TagV2>>,
  Assert<Same<TagGroupV1, TagGroupV2>>,
  Assert<Same<InputV1, InputV2>>,
  Assert<Same<CheckboxV1, CheckboxV2>>,
  Assert<Same<CheckedStateV1, CheckedStateV2>>,
  Assert<Same<SwitchV1, SwitchV2>>,
];
