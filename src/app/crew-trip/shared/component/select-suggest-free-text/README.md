# Select Suggest Free Text Component

Component `app-select-suggest-free-text` được tạo mới để hỗ trợ nhập text tự do khi không tìm thấy option phù hợp.

## Tính năng

- **Chọn từ danh sách**: Người dùng có thể chọn từ danh sách options có sẵn
- **Nhập text tự do**: Khi không tìm thấy option phù hợp, người dùng có thể nhập text tự do
- **Giữ giá trị khi blur**: Giá trị không bị mất khi focus out khỏi input
- **Validation**: Hỗ trợ form validation
- **Clear input**: Có thể clear input bằng icon X

## Cách sử dụng

### Basic usage

```html
<app-select-suggest-free-text 
  [options]="listOptions" 
  label="Select or Enter"
  attrValue="id" 
  attrDisplay="name"
  formControlName="selectedOption"
  (selectionChange)="onSelectionChange($event)">
</app-select-suggest-free-text>
```

### Với các thuộc tính khác

```html
<app-select-suggest-free-text 
  size="sm"
  [options]="listOptions" 
  label="Select or Enter"
  attrValue="id" 
  attrDisplay="name"
  attrDisplay2="description"
  formControlName="selectedOption"
  [editInlineTable]="true"
  (selectionChange)="onSelectionChange($event)"
  (clearInputEvent)="onClearInput()">
</app-select-suggest-free-text>
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `size` | string | 'sm' | Kích thước input |
| `label` | string | '' | Label hiển thị |
| `label2` | string | '' | Label thay thế |
| `attrValue` | string | '' | Thuộc tính để lấy giá trị |
| `attrDisplay` | string | '' | Thuộc tính để hiển thị |
| `attrDisplay2` | string | '' | Thuộc tính hiển thị phụ |
| `options` | any[] | [] | Danh sách options |
| `editInlineTable` | boolean | false | Chế độ edit inline table |
| `errors` | any | null | Lỗi validation |

## Output Events

### selectionChange
Event được emit khi có thay đổi selection:

```typescript
{
  value: any,        // Giá trị được chọn hoặc nhập
  viewValue: string, // Text hiển thị
  isFreeText: boolean // true nếu là text tự do, false nếu chọn từ danh sách
}
```

### clearInputEvent
Event được emit khi clear input.

## Ví dụ xử lý event

```typescript
onSelectionChange(event: any) {
  if (event.isFreeText) {
    // Xử lý khi người dùng nhập text tự do
    console.log('Free text entered:', event.value);
  } else {
    // Xử lý khi người dùng chọn từ danh sách
    console.log('Selected from list:', event.value);
  }
}

onClearInput() {
  console.log('Input cleared');
}
```

## Cách hoạt động

1. **Khi người dùng nhập text**:
   - Component sẽ filter danh sách options
   - Nếu tìm thấy option khớp, hiển thị trong dropdown
   - Nếu không tìm thấy, cho phép nhập text tự do

2. **Khi người dùng blur khỏi input**:
   - Kiểm tra xem có option khớp không
   - Nếu không khớp, lưu giá trị như free text
   - Emit event `selectionChange` với `isFreeText: true`

3. **Khi người dùng chọn từ dropdown**:
   - Lưu giá trị của option được chọn
   - Emit event `selectionChange` với `isFreeText: false`

## So sánh với component cũ

| Tính năng | selection-suggest | select-suggest-free-text |
|-----------|-------------------|--------------------------|
| Chọn từ danh sách | ✅ | ✅ |
| Nhập text tự do | ❌ | ✅ |
| Giữ giá trị khi blur | ❌ | ✅ |
| Validation | ✅ | ✅ |
| Clear input | ✅ | ✅ |

## Lưu ý

- Component này được thiết kế để thay thế `selection-suggest` trong các trường hợp cần nhập text tự do
- Giá trị nhập vào sẽ được lưu vào form control như một string
- Validation vẫn hoạt động bình thường
- Component sử dụng multiple event handlers để đảm bảo giá trị không bị mất 