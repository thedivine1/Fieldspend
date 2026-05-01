import { c as createLucideIcon, j as jsxRuntimeExports, r as reactExports, a as useAppStore, M as MONTH_KEYS, t as tLang, b as Link } from "./index-NKFMDfSM.js";
import { u as useComposedRefs, c as composeEventHandlers, a as createSlottable, b as createContextScope, d as cn, e as buttonVariants, B as Button, f as Badge } from "./index-i7t4yTMw.js";
import { R as Root, W as WarningProvider, C as Content, T as Title, D as Description, a as Close, c as createDialogScope, P as Portal, O as Overlay, b as Trigger, d as Dialog, e as DialogContent, f as DialogHeader, g as DialogTitle, h as DialogFooter } from "./dialog-D0-wcGYn.js";
import { L as Label, I as Input } from "./label-soMCdqAK.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-TiDxaxb4.js";
import { T as Textarea } from "./textarea-CkKtWNN1.js";
import { m as motion } from "./proxy-sPmYolkV.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$6 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$6);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "9", cy: "12", r: "1", key: "1vctgf" }],
  ["circle", { cx: "9", cy: "5", r: "1", key: "hp0tcf" }],
  ["circle", { cx: "9", cy: "19", r: "1", key: "fkjjf6" }],
  ["circle", { cx: "15", cy: "12", r: "1", key: "1tmaij" }],
  ["circle", { cx: "15", cy: "5", r: "1", key: "19l28e" }],
  ["circle", { cx: "15", cy: "19", r: "1", key: "f4zoj3" }]
];
const GripVertical = createLucideIcon("grip-vertical", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12", key: "o97t9d" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ]
];
const Inbox = createLucideIcon("inbox", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }]
];
const Trash = createLucideIcon("trash", __iconNode);
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext] = createContextScope(ROOT_NAME, [
  createDialogScope
]);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ...dialogScope, ...alertDialogProps, modal: true });
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { ...dialogScope, ...triggerProps, ref: forwardedRef });
  }
);
AlertDialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...dialogScope, ...portalProps });
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { ...dialogScope, ...overlayProps, ref: forwardedRef });
  }
);
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME);
var Slottable = createSlottable("AlertDialogContent");
var AlertDialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = reactExports.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      WarningProvider,
      {
        contentName: CONTENT_NAME,
        titleName: TITLE_NAME,
        docsSlug: "alert-dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogContentProvider, { scope: __scopeAlertDialog, cancelRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            role: "alertdialog",
            ...dialogScope,
            ...contentProps,
            ref: composedRefs,
            onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              var _a;
              event.preventDefault();
              (_a = cancelRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
            }),
            onPointerDownOutside: (event) => event.preventDefault(),
            onInteractOutside: (event) => event.preventDefault(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef })
            ]
          }
        ) })
      }
    );
  }
);
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { ...dialogScope, ...titleProps, ref: forwardedRef });
  }
);
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { ...dialogScope, ...descriptionProps, ref: forwardedRef });
});
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...actionProps, ref: forwardedRef });
  }
);
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...cancelProps, ref });
  }
);
AlertDialogCancel$1.displayName = CANCEL_NAME;
var DescriptionWarning = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  reactExports.useEffect(() => {
    var _a;
    const hasDescription = document.getElementById(
      (_a = contentRef.current) == null ? void 0 : _a.getAttribute("aria-describedby")
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);
  return null;
};
var Root2 = AlertDialog$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay2,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2,
      {
        "data-slot": "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title2,
    {
      "data-slot": "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description2,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Action,
    {
      className: cn(buttonVariants(), className),
      ...props
    }
  );
}
function AlertDialogCancel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Cancel,
    {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props
    }
  );
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
const CATEGORY_COLORS = {
  cab: "badge-cab",
  train: "badge-train",
  bus: "badge-bus",
  localBus: "badge-bus",
  auto: "badge-cab",
  flight: "badge-flight",
  hotel: "badge-hotel",
  meal: "badge-meal",
  other: "badge-other"
};
const CATEGORY_ICONS = {
  cab: "🚕",
  train: "🚆",
  bus: "🚌",
  localBus: "🚐",
  auto: "🛺",
  flight: "✈️",
  hotel: "🏨",
  meal: "🍽️",
  other: "📄"
};
const CATEGORIES = [
  "cab",
  "auto",
  "localBus",
  "train",
  "bus",
  "flight",
  "hotel",
  "meal",
  "other"
];
function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}
function formatDayLabel(dateStr) {
  const date = /* @__PURE__ */ new Date(`${dateStr}T12:00:00`);
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const yesterday = /* @__PURE__ */ new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];
  const full = date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  if (dateStr === todayStr) return `Today — ${full}`;
  if (dateStr === yesterdayStr) return `Yesterday — ${full}`;
  return full;
}
function buildDaySummary(receipts, lang) {
  const catCounts = {};
  for (const r of receipts) {
    catCounts[r.category] = (catCounts[r.category] ?? 0) + 1;
  }
  const parts = Object.entries(catCounts).map(
    ([cat, cnt]) => `${cnt} ${tLang(`cat.${cat}`, lang)}`
  );
  const total = receipts.reduce((s, r) => s + (r.amount ?? 0), 0);
  return `${parts.join(", ")} — ${formatCurrency(total)} total`;
}
function groupByDay(receipts, month, year) {
  const filtered = receipts.filter((r) => {
    const d = /* @__PURE__ */ new Date(`${r.date}T12:00:00`);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
  const map = /* @__PURE__ */ new Map();
  for (const r of filtered) {
    const arr = map.get(r.date) ?? [];
    arr.push(r);
    map.set(r.date, arr);
  }
  const groups = [];
  for (const [dateStr, items] of map.entries()) {
    items.sort((a, b) => b.createdAt - a.createdAt);
    const total = items.reduce((s, r) => s + (r.amount ?? 0), 0);
    groups.push({
      dateStr,
      label: formatDayLabel(dateStr),
      receipts: items,
      total
    });
  }
  return groups.sort((a, b) => b.dateStr.localeCompare(a.dateStr));
}
function MonthSelector() {
  const {
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    currentLanguage
  } = useAppStore();
  const monthNames = MONTH_KEYS.map((key) => tLang(key, currentLanguage));
  function prev() {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  }
  function next() {
    const now2 = /* @__PURE__ */ new Date();
    const isCurrentMonth2 = selectedMonth === now2.getMonth() + 1 && selectedYear === now2.getFullYear();
    if (isCurrentMonth2) return;
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  }
  const now = /* @__PURE__ */ new Date();
  const isCurrentMonth = selectedMonth === now.getMonth() + 1 && selectedYear === now.getFullYear();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 bg-card border-b border-border sticky top-0 z-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: prev,
        className: "w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors",
        "aria-label": "Previous month",
        "data-ocid": "gallery.month_prev",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { size: 18, className: "text-foreground" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-semibold text-foreground text-base", children: [
      monthNames[selectedMonth - 1],
      " ",
      selectedYear
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: next,
        disabled: isCurrentMonth,
        className: "w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
        "aria-label": "Next month",
        "data-ocid": "gallery.month_next",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 18, className: "text-foreground" })
      }
    )
  ] });
}
function EditModal({ receipt, onClose, onSave }) {
  const { currentLanguage } = useAppStore();
  const lang = currentLanguage;
  const [date, setDate] = reactExports.useState((receipt == null ? void 0 : receipt.date) ?? "");
  const [category, setCategory] = reactExports.useState(
    (receipt == null ? void 0 : receipt.category) ?? "other"
  );
  const [amount, setAmount] = reactExports.useState(
    (receipt == null ? void 0 : receipt.amount) != null ? String(receipt.amount) : ""
  );
  const [notes, setNotes] = reactExports.useState((receipt == null ? void 0 : receipt.notes) ?? "");
  const [saving, setSaving] = reactExports.useState(false);
  async function handleSave() {
    if (!receipt) return;
    setSaving(true);
    await onSave({
      ...receipt,
      date,
      category,
      amount: amount ? Number(amount) : void 0,
      notes: notes || void 0
    });
    setSaving(false);
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!receipt, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm mx-4", "data-ocid": "gallery.edit_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: tLang("action.edit", lang) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-date", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "edit-date",
            type: "date",
            value: date,
            onChange: (e) => setDate(e.target.value),
            className: "w-full",
            "data-ocid": "gallery.edit_date_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-category", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: category,
            onValueChange: (v) => setCategory(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  id: "edit-category",
                  "data-ocid": "gallery.edit_category_select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: cat, children: [
                CATEGORY_ICONS[cat],
                " ",
                tLang(`cat.${cat}`, lang)
              ] }, cat)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-amount", children: "Amount (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "edit-amount",
            type: "number",
            min: "0",
            step: "0.01",
            placeholder: "0.00",
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            "data-ocid": "gallery.edit_amount_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-notes", children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "edit-notes",
            placeholder: "Add notes…",
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            rows: 2,
            "data-ocid": "gallery.edit_notes_textarea"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: onClose,
          "data-ocid": "gallery.edit_cancel_button",
          children: tLang("action.cancel", lang)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleSave,
          disabled: saving || !date,
          "data-ocid": "gallery.edit_save_button",
          children: saving ? tLang("settings.saving", lang) : tLang("action.save", lang)
        }
      )
    ] })
  ] }) });
}
function DeleteDialog({ open, onClose, onConfirm }) {
  const { currentLanguage } = useAppStore();
  const lang = currentLanguage;
  const [deleting, setDeleting] = reactExports.useState(false);
  async function handleConfirm() {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    AlertDialogContent,
    {
      className: "max-w-sm mx-4",
      "data-ocid": "gallery.delete_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this receipt?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "This action cannot be undone. The receipt will be permanently removed." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogCancel,
            {
              onClick: onClose,
              "data-ocid": "gallery.delete_cancel_button",
              children: tLang("action.cancel", lang)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AlertDialogAction,
            {
              onClick: handleConfirm,
              disabled: deleting,
              className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
              "data-ocid": "gallery.delete_confirm_button",
              children: deleting ? "…" : tLang("action.delete", lang)
            }
          )
        ] })
      ]
    }
  ) });
}
function ReceiptCard({
  receipt,
  index,
  dayIndex,
  isDraggingThis,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDropOnCard
}) {
  const { currentLanguage } = useAppStore();
  const catColor = CATEGORY_COLORS[receipt.category];
  const catIcon = CATEGORY_ICONS[receipt.category];
  const longPressTimer = reactExports.useRef(null);
  const cardRef = reactExports.useRef(null);
  function handlePointerDown() {
    longPressTimer.current = setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.draggable = true;
      }
    }, 400);
  }
  function handlePointerUp() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }
  function handleNativeDragStart(e) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", receipt.id);
    onDragStart(receipt.id, receipt.date);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: cardRef,
      draggable: true,
      onDragStart: handleNativeDragStart,
      onDragOver,
      onDrop: (e) => onDropOnCard(e, receipt.id, receipt.date),
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
      className: `receipt-card flex items-center gap-3 p-3 cursor-default select-none transition-opacity duration-150 ${isDraggingThis ? "opacity-40 scale-[0.98]" : "opacity-100"}`,
      "data-ocid": `gallery.receipt.${dayIndex}.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "shrink-0 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-0.5",
            "aria-label": "Drag to reorder",
            "data-ocid": `gallery.drag_handle.${dayIndex}.${index}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { size: 16 })
          }
        ),
        receipt.imageData ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: receipt.imageData,
            alt: "receipt",
            className: "w-14 h-14 rounded-lg object-cover shrink-0 border border-border"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0 text-2xl", children: catIcon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: `text-[10px] px-1.5 py-0 h-4 shrink-0 ${catColor}`,
              children: [
                catIcon,
                " ",
                tLang(`cat.${receipt.category}`, currentLanguage)
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: receipt.notes ? receipt.notes : (/* @__PURE__ */ new Date(`${receipt.date}T12:00:00`)).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short"
          }) }),
          receipt.amount != null && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-amount text-primary text-sm mt-0.5", children: formatCurrency(receipt.amount) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onEdit(receipt),
              className: "w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground",
              "aria-label": "Edit receipt",
              "data-ocid": `gallery.edit_button.${dayIndex}.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onDelete(receipt.id),
              className: "w-8 h-8 flex items-center justify-center rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive",
              "aria-label": "Delete receipt",
              "data-ocid": `gallery.delete_button.${dayIndex}.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { size: 14 })
            }
          )
        ] })
      ]
    }
  );
}
function DayDropZone({
  dateStr,
  position,
  isDragActive,
  isDragOver,
  onDragEnter,
  onDragLeave,
  onDrop
}) {
  if (!isDragActive) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      onDragEnter,
      onDragLeave,
      onDragOver: (e) => e.preventDefault(),
      onDrop: (e) => onDrop(e, dateStr),
      className: `mx-4 rounded-lg border-2 border-dashed transition-all duration-150 ${position === "top" ? "mt-2 mb-1" : "mt-1 mb-2"} ${isDragOver ? "border-cyan-400 bg-cyan-400/10 h-10 flex items-center justify-center" : "border-border/50 h-2"}`,
      "aria-hidden": "true",
      children: isDragOver && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-cyan-400 font-medium pointer-events-none", children: "Drop here" })
    }
  );
}
function DayGroupCard({
  group,
  groupIndex,
  activeDrag,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onSameDayReorder,
  onCrossDayDrop
}) {
  const { currentLanguage } = useAppStore();
  const [topZoneOver, setTopZoneOver] = reactExports.useState(false);
  const [bottomZoneOver, setBottomZoneOver] = reactExports.useState(false);
  const [headerOver, setHeaderOver] = reactExports.useState(false);
  const containerRef = reactExports.useRef(null);
  const [isVisible, setIsVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const isDragFromOtherDay = activeDrag !== null && activeDrag.sourceDateStr !== group.dateStr;
  const isDropTarget = isDragFromOtherDay && (topZoneOver || bottomZoneOver || headerOver);
  function handleHeaderDragOver(e) {
    if (!isDragFromOtherDay) return;
    e.preventDefault();
    setHeaderOver(true);
  }
  function handleHeaderDragLeave() {
    setHeaderOver(false);
  }
  function handleHeaderDrop(e) {
    e.preventDefault();
    setHeaderOver(false);
    if (activeDrag && isDragFromOtherDay) {
      onCrossDayDrop(activeDrag.receiptId, group.dateStr);
    }
    onDragEnd();
  }
  function handleZoneDrop(e, targetDateStr) {
    e.preventDefault();
    setTopZoneOver(false);
    setBottomZoneOver(false);
    if (activeDrag && isDragFromOtherDay) {
      onCrossDayDrop(activeDrag.receiptId, targetDateStr);
    }
    onDragEnd();
  }
  function handleCardDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
  function handleDropOnCard(e, targetReceiptId, targetDateStr) {
    e.preventDefault();
    if (!activeDrag) return;
    if (activeDrag.sourceDateStr === group.dateStr) {
      const current = [...group.receipts];
      const fromIdx = current.findIndex((r) => r.id === activeDrag.receiptId);
      const toIdx = current.findIndex((r) => r.id === targetReceiptId);
      if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
        const [moved] = current.splice(fromIdx, 1);
        current.splice(toIdx, 0, moved);
        onSameDayReorder(group.dateStr, current);
      }
    } else {
      onCrossDayDrop(activeDrag.receiptId, targetDateStr);
    }
    onDragEnd();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      ref: containerRef,
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: groupIndex * 0.05 },
      "data-ocid": `gallery.day_group.${groupIndex + 1}`,
      onDragEnd,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DayDropZone,
          {
            dateStr: group.dateStr,
            position: "top",
            isDragActive: isDragFromOtherDay,
            isDragOver: topZoneOver,
            onDragEnter: () => setTopZoneOver(true),
            onDragLeave: () => setTopZoneOver(false),
            onDrop: handleZoneDrop
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `daily-header sticky top-[57px] z-10 backdrop-blur-sm transition-all duration-150 ${isDropTarget || headerOver ? "border-2 border-dashed border-cyan-400 bg-cyan-400/10 rounded-lg mx-2" : ""}`,
            onDragOver: handleHeaderDragOver,
            onDragLeave: handleHeaderDragLeave,
            onDrop: handleHeaderDrop,
            "data-ocid": `gallery.day_header.${groupIndex + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: group.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5 truncate", children: buildDaySummary(group.receipts, currentLanguage) })
              ] }),
              group.total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-primary shrink-0 ml-3 font-mono", children: formatCurrency(group.total) }),
              headerOver && activeDrag && isDragFromOtherDay && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-[11px] text-cyan-400 font-semibold shrink-0 pointer-events-none", children: "Move here" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 space-y-2", children: isVisible ? group.receipts.map((receipt, ri) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ReceiptCard,
          {
            receipt,
            index: ri + 1,
            dayIndex: groupIndex + 1,
            isDraggingThis: (activeDrag == null ? void 0 : activeDrag.receiptId) === receipt.id,
            onEdit,
            onDelete,
            onDragStart,
            onDragOver: handleCardDragOver,
            onDropOnCard: handleDropOnCard
          },
          receipt.id
        )) : (
          // Placeholder while off-screen
          group.receipts.map((r, ri) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-[88px] rounded-xl bg-muted/40 animate-pulse",
              style: { animationDelay: `${ri * 50}ms` }
            },
            `skeleton-${r.id}`
          ))
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DayDropZone,
          {
            dateStr: group.dateStr,
            position: "bottom",
            isDragActive: isDragFromOtherDay,
            isDragOver: bottomZoneOver,
            onDragEnter: () => setBottomZoneOver(true),
            onDragLeave: () => setBottomZoneOver(false),
            onDrop: handleZoneDrop
          }
        )
      ]
    }
  );
}
function EmptyState({ hasMonthFilter }) {
  const { currentLanguage } = useAppStore();
  const lang = currentLanguage;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.96 },
      animate: { opacity: 1, scale: 1 },
      className: "flex flex-col items-center justify-center min-h-[50vh] px-8 text-center",
      "data-ocid": "gallery.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-5 text-4xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { size: 40, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-xl text-foreground mb-2", children: hasMonthFilter ? tLang("report.no_receipts", lang) : tLang("status.no_receipts", lang) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6 max-w-xs", children: hasMonthFilter ? tLang("report.no_receipts", lang) : tLang("onboard.step1.desc", lang) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", "data-ocid": "gallery.upload_button", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/upload", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 18, className: "mr-2" }),
          tLang("action.upload", lang)
        ] }) })
      ]
    }
  );
}
function MonthTotalBar({
  groups,
  month,
  year
}) {
  const { currentLanguage } = useAppStore();
  const monthNames = MONTH_KEYS.map((key) => tLang(key, currentLanguage));
  const grandTotal = groups.reduce((s, g) => s + g.total, 0);
  const receiptCount = groups.reduce((s, g) => s + g.receipts.length, 0);
  if (receiptCount === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky bottom-0 z-20 bg-card border-t border-border px-4 py-3 flex items-center justify-between shadow-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-medium", children: [
        monthNames[month - 1],
        " ",
        year,
        " — ",
        receiptCount,
        " ",
        tLang("report.receipts", currentLanguage)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mt-0.5", children: tLang("report.total", currentLanguage) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amount text-primary text-xl", children: formatCurrency(grandTotal) })
  ] });
}
function GalleryPage() {
  const {
    receipts,
    selectedMonth,
    selectedYear,
    updateReceipt,
    deleteReceipt
  } = useAppStore();
  const [editingReceipt, setEditingReceipt] = reactExports.useState(null);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const [isLoadingReceipts, setIsLoadingReceipts] = reactExports.useState(true);
  reactExports.useEffect(() => {
    setIsLoadingReceipts(false);
  }, []);
  const [activeDrag, setActiveDrag] = reactExports.useState(null);
  const [dayOrders, setDayOrders] = reactExports.useState(/* @__PURE__ */ new Map());
  const groups = reactExports.useMemo(() => {
    const base = groupByDay(receipts, selectedMonth, selectedYear);
    return base.map((g) => {
      const local = dayOrders.get(g.dateStr);
      if (local) {
        const validIds = new Set(g.receipts.map((r) => r.id));
        const reconciled = local.filter((r) => validIds.has(r.id));
        const inLocal = new Set(reconciled.map((r) => r.id));
        const extras = g.receipts.filter((r) => !inLocal.has(r.id));
        return { ...g, receipts: [...reconciled, ...extras] };
      }
      return g;
    });
  }, [receipts, selectedMonth, selectedYear, dayOrders]);
  const handleDragStart = reactExports.useCallback(
    (receiptId, sourceDateStr) => {
      setActiveDrag({ receiptId, sourceDateStr });
    },
    []
  );
  const handleDragEnd = reactExports.useCallback(() => {
    setActiveDrag(null);
  }, []);
  const handleSameDayReorder = reactExports.useCallback(
    (dateStr, newOrder) => {
      setDayOrders((prev) => new Map(prev).set(dateStr, newOrder));
    },
    []
  );
  const handleCrossDayDrop = reactExports.useCallback(
    async (receiptId, targetDateStr) => {
      const receipt = receipts.find((r) => r.id === receiptId);
      if (!receipt || receipt.date === targetDateStr) return;
      const updated = { ...receipt, date: targetDateStr };
      setDayOrders((prev) => {
        const next = new Map(prev);
        const sourceDateStr = receipt.date;
        const sourceOrder = next.get(sourceDateStr);
        if (sourceOrder) {
          next.set(
            sourceDateStr,
            sourceOrder.filter((r) => r.id !== receiptId)
          );
        }
        next.delete(targetDateStr);
        return next;
      });
      await updateReceipt(updated);
    },
    [receipts, updateReceipt]
  );
  const handleSaveEdit = reactExports.useCallback(
    async (updated) => {
      await updateReceipt(updated);
    },
    [updateReceipt]
  );
  const handleConfirmDelete = reactExports.useCallback(async () => {
    if (!deletingId) return;
    await deleteReceipt(deletingId);
    setDayOrders((prev) => {
      const next = new Map(prev);
      for (const [k, arr] of next.entries()) {
        next.set(
          k,
          arr.filter((r) => r.id !== deletingId)
        );
      }
      return next;
    });
  }, [deletingId, deleteReceipt]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col min-h-full",
      "data-ocid": "gallery.page",
      onDragEnd: handleDragEnd,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MonthSelector, {}),
        isLoadingReceipts ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-4", "data-ocid": "gallery.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-3/4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" })
        ] }, i)) }) : groups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { hasMonthFilter: receipts.length > 0 }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 pb-2", children: groups.map((group, gi) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            DayGroupCard,
            {
              group,
              groupIndex: gi,
              activeDrag,
              onEdit: setEditingReceipt,
              onDelete: setDeletingId,
              onDragStart: handleDragStart,
              onDragEnd: handleDragEnd,
              onSameDayReorder: handleSameDayReorder,
              onCrossDayDrop: handleCrossDayDrop
            },
            group.dateStr
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MonthTotalBar,
            {
              groups,
              month: selectedMonth,
              year: selectedYear
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          EditModal,
          {
            receipt: editingReceipt,
            onClose: () => setEditingReceipt(null),
            onSave: handleSaveEdit
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DeleteDialog,
          {
            open: !!deletingId,
            onClose: () => setDeletingId(null),
            onConfirm: handleConfirmDelete
          }
        )
      ]
    }
  );
}
export {
  GalleryPage as default
};
