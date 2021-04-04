// Variables

let myNodeList = document.querySelector('#myUl');
let close = document.querySelectorAll('.close');
const tasksListElement = document.querySelector(`.tasks__list`);
const sortElements = document.querySelector(`.sort-wrap`);
const filterElements = document.querySelector(`.filter-wrap`);
let arrayChildren;

// State
let state = {
    tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
    filter: JSON.parse(localStorage.getItem('filter') || '[]'),
    info: {canFilter: false, canSort: false},
    sorted: JSON.parse(localStorage.getItem('sorted') || '[]'),
};

// Функция отрисовки и перерисовки контента
function render() {
    document.getElementById('myInput').value = '';
    while (myNodeList.firstChild) {
        myNodeList.removeChild(myNodeList.firstChild);
    }
    for (let i = 0; i < state.tasks.length; i++) {

        myNodeList.insertAdjacentHTML('beforeend',
            `<li class="${state.tasks[i].checked ? `checked` : ''} 
                    ${state.tasks[i].status === "complete" ? `complete` : (state.tasks[i].status === "outcome" ) ? `outcome` : state.tasks[i].status === "process" ? `process` : ''} 
                    ${state.tasks[i].hidden ? `hidden` : ''} 
                 
                    ${state.tasks[i].redaction ? `redaction` : ''} task" 
                    data-id="${state.tasks[i].id}"     
                    draggable="true">
                        <button class="sq-btn after-check btn-back" onclick="check(${state.tasks[i].id})" ><svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.75 2.70004H0.762625L2.67237 0.517267C2.77237 0.402968 2.77625 0.213071 2.681 0.093072C2.58588 -0.0267765 2.42763 -0.0315765 2.3275 0.0827221L0.1465 2.57569C0.052125 2.68909 0 2.83969 0 3.00004C0 3.16023 0.052125 3.31098 0.150875 3.42933L2.32763 5.9172C2.376 5.97255 2.438 6 2.5 6C2.566 6 2.632 5.9688 2.68112 5.90685C2.77637 5.78685 2.7725 5.59711 2.6725 5.48281L0.75475 3.30003H5.75C5.888 3.30003 6 3.16563 6 3.00004C6 2.83444 5.888 2.70004 5.75 2.70004Z" fill="black"/></svg></button>
                        <button class="${state.tasks[i].status === "complete" ? `status-complete` : ''} after-check sq-btn" id="done" ><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49998 0C3.35786 0 0 3.35786 0 7.49998C0 11.6421 3.35786 15 7.49998 15C11.6421 15 15 11.6421 15 7.49998C14.9956 3.35971 11.6403 0.00442592 7.49998 0ZM7.49998 13.9286C3.94958 13.9286 1.07142 11.0504 1.07142 7.49998C1.07142 3.94958 3.94958 1.07142 7.49998 1.07142C11.0504 1.07142 13.9286 3.94958 13.9286 7.49998C13.9247 11.0488 11.0488 13.9247 7.49998 13.9286Z" fill="#26A27C"/><path d="M11.6155 4.4427C11.4079 4.24218 11.0788 4.24218 10.8712 4.4427L5.8928 9.42108L4.12867 7.65696C3.92314 7.44413 3.58397 7.43826 3.37118 7.6438C3.15836 7.84934 3.15249 8.1885 3.35803 8.40129C3.36233 8.40575 3.36673 8.41015 3.37118 8.41445L5.51405 10.5573C5.72323 10.7665 6.06236 10.7665 6.27154 10.5573L11.6287 5.20016C11.8342 4.98737 11.8283 4.64824 11.6155 4.4427Z" fill="#26A27C"/></svg></button>
                        <button class="${state.tasks[i].status === "process" ? `status-process` : ''} after-check sq-btn" id="loading" ><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8032 2.19667C11.3867 0.780108 9.5033 0 7.50002 0C5.49666 0 3.6133 0.780108 2.19678 2.19667C0.780146 3.61326 0 5.4967 0 7.49998C0 9.50338 0.780146 11.3868 2.19678 12.8033C3.6133 14.2199 5.4967 15 7.50002 15C9.50323 15 11.3867 14.2199 12.8033 12.8033C14.2199 11.3867 15 9.50334 15 7.49998C15 5.49674 14.2199 3.6133 12.8032 2.19667ZM7.50002 2.9091C10.0315 2.9091 12.0909 4.96856 12.0909 7.49998C12.0909 10.0314 10.0315 12.0909 7.50002 12.0909C4.96856 12.0909 2.9091 10.0314 2.9091 7.49998C2.9091 4.96856 4.96856 2.9091 7.50002 2.9091ZM12.3212 12.3212C11.0334 13.6089 9.32119 14.3181 7.50002 14.3181C5.67882 14.3181 3.96664 13.6089 2.67887 12.3212C1.39106 11.0335 0.68182 9.32122 0.68182 7.49994H2.22724C2.22724 10.4073 4.59258 12.7727 7.50002 12.7727C10.4074 12.7727 12.7727 10.4073 12.7727 7.49994C12.7727 4.59254 10.4074 2.2272 7.50002 2.2272C7.32748 2.2272 7.15697 2.2358 6.98867 2.25206V0.700561C7.15798 0.688092 7.32853 0.681782 7.50002 0.681782C9.32119 0.681782 11.0334 1.39098 12.3212 2.67876C13.609 3.96657 14.3182 5.67878 14.3182 7.49994C14.3181 9.32126 13.609 11.0335 12.3212 12.3212Z" fill="#78741E"/></svg></button>
                        <button class="${state.tasks[i].status === "outcome" ? `status-outcome` : ''} after-check sq-btn" id="undone"  ><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.803 2.19697C11.3857 0.779672 9.50442 0 7.5 0C5.49558 0 3.61427 0.779672 2.19697 2.19697C0.779672 3.61427 0 5.49558 0 7.5C0 9.50442 0.779672 11.3857 2.19697 12.803C3.61427 14.2203 5.49558 15 7.5 15C9.50442 15 11.3857 14.2203 12.803 12.803C14.2203 11.3857 15 9.50442 15 7.5C15 5.49558 14.2203 3.61427 12.803 2.19697ZM12.2001 12.2001C10.9438 13.4564 9.27399 14.1477 7.5 14.1477C5.72601 14.1477 4.05619 13.4564 2.79987 12.2001C0.208333 9.60859 0.208333 5.39141 2.79987 2.79987C4.05619 1.54356 5.72601 0.852273 7.5 0.852273C9.27399 0.852273 10.9438 1.54356 12.2001 2.79987C14.7917 5.39141 14.7917 9.60859 12.2001 12.2001Z" fill="#954863"/><path d="M10.8049 4.19508C10.6376 4.02778 10.3693 4.02778 10.202 4.19508L7.49997 6.8971L4.79796 4.19508C4.63066 4.02778 4.36235 4.02778 4.19505 4.19508C4.02776 4.36237 4.02776 4.63068 4.19505 4.79798L6.89707 7.5L4.19505 10.202C4.02776 10.3693 4.02776 10.6376 4.19505 10.8049C4.27712 10.887 4.3876 10.9312 4.49493 10.9312C4.60225 10.9312 4.71273 10.8902 4.7948 10.8049L7.49681 8.10291L10.1988 10.8049C10.2809 10.887 10.3914 10.9312 10.4987 10.9312C10.6092 10.9312 10.7165 10.8902 10.7986 10.8049C10.9659 10.6376 10.9659 10.3693 10.7986 10.202L8.10287 7.5L10.8049 4.79798C10.9722 4.63068 10.9722 4.36237 10.8049 4.19508Z" fill="#954863"/></svg></button>
                <div class="content">
                     ${state.tasks[i].redaction
                         ? `<input type="text" value="${state.tasks[i].name}" id="update-input" class="redaction"/>`
                         : `<p class="fw900">${state.tasks[i].name} </p> <p class="status"> <span class="fw900 ">Статус: </span> ${state.tasks[i].status === "complete" ?
                            `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M7.49998 0C3.35786 0 0 3.35786 0 7.49998C0 11.6421 3.35786 15 7.49998 15C11.6421 15 15 11.6421 15 7.49998C14.9956 3.35971 11.6403 0.00442592 7.49998 0ZM7.49998 13.9286C3.94958 13.9286 1.07142 11.0504 1.07142 7.49998C1.07142 3.94958 3.94958 1.07142 7.49998 1.07142C11.0504 1.07142 13.9286 3.94958 13.9286 7.49998C13.9247 11.0488 11.0488 13.9247 7.49998 13.9286Z" fill="#26A27C"/>
                                <path d="M11.6156 4.4427C11.408 4.24218 11.0788 4.24218 10.8713 4.4427L5.89286 9.42108L4.12874 7.65696C3.9232 7.44413 3.58403 7.43826 3.37124 7.6438C3.15842 7.84934 3.15255 8.1885 3.35809 8.40129C3.36239 8.40575 3.36679 8.41015 3.37124 8.41445L5.51411 10.5573C5.72329 10.7665 6.06242 10.7665 6.2716 10.5573L11.6288 5.20016C11.8343 4.98737 11.8284 4.64824 11.6156 4.4427Z" fill="#26A27C"/>
                            </svg>` : state.tasks[i].status === "outcome" ?
                            `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.803 2.19697C11.3857 0.779672 9.50442 0 7.5 0C5.49558 0 3.61427 0.779672 2.19697 2.19697C0.779672 3.61427 0 5.49558 0 7.5C0 9.50442 0.779672 11.3857 2.19697 12.803C3.61427 14.2203 5.49558 15 7.5 15C9.50442 15 11.3857 14.2203 12.803 12.803C14.2203 11.3857 15 9.50442 15 7.5C15 5.49558 14.2203 3.61427 12.803 2.19697ZM12.2001 12.2001C10.9438 13.4564 9.27399 14.1477 7.5 14.1477C5.72601 14.1477 4.05619 13.4564 2.79987 12.2001C0.208333 9.60859 0.208333 5.39141 2.79987 2.79987C4.05619 1.54356 5.72601 0.852273 7.5 0.852273C9.27399 0.852273 10.9438 1.54356 12.2001 2.79987C14.7917 5.39141 14.7917 9.60859 12.2001 12.2001Z" fill="#954863"/>
                                <path d="M10.8049 4.19507C10.6376 4.02777 10.3693 4.02777 10.202 4.19507L7.5 6.89709L4.79799 4.19507C4.63069 4.02777 4.36238 4.02777 4.19508 4.19507C4.02779 4.36237 4.02779 4.63068 4.19508 4.79797L6.8971 7.49999L4.19508 10.202C4.02779 10.3693 4.02779 10.6376 4.19508 10.8049C4.27715 10.887 4.38763 10.9312 4.49496 10.9312C4.60228 10.9312 4.71276 10.8901 4.79483 10.8049L7.49684 8.1029L10.1989 10.8049C10.2809 10.887 10.3914 10.9312 10.4987 10.9312C10.6092 10.9312 10.7165 10.8901 10.7986 10.8049C10.9659 10.6376 10.9659 10.3693 10.7986 10.202L8.1029 7.49999L10.8049 4.79797C10.9722 4.63068 10.9722 4.36237 10.8049 4.19507Z" fill="#954863"/>
                            </svg>` :
                            `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.8032 2.19667C11.3867 0.780108 9.5033 0 7.50002 0C5.49666 0 3.6133 0.780108 2.19678 2.19667C0.780146 3.61326 0 5.4967 0 7.49998C0 9.50338 0.780146 11.3868 2.19678 12.8033C3.6133 14.2199 5.4967 15 7.50002 15C9.50323 15 11.3867 14.2199 12.8033 12.8033C14.2199 11.3867 15 9.50334 15 7.49998C15 5.49674 14.2199 3.6133 12.8032 2.19667ZM7.50002 2.9091C10.0315 2.9091 12.0909 4.96856 12.0909 7.49998C12.0909 10.0314 10.0315 12.0909 7.50002 12.0909C4.96856 12.0909 2.9091 10.0314 2.9091 7.49998C2.9091 4.96856 4.96856 2.9091 7.50002 2.9091ZM12.3212 12.3212C11.0334 13.6089 9.32119 14.3181 7.50002 14.3181C5.67882 14.3181 3.96664 13.6089 2.67887 12.3212C1.39106 11.0335 0.68182 9.32122 0.68182 7.49994H2.22724C2.22724 10.4073 4.59258 12.7727 7.50002 12.7727C10.4074 12.7727 12.7727 10.4073 12.7727 7.49994C12.7727 4.59254 10.4074 2.2272 7.50002 2.2272C7.32748 2.2272 7.15697 2.2358 6.98867 2.25206V0.700561C7.15798 0.688092 7.32853 0.681782 7.50002 0.681782C9.32119 0.681782 11.0334 1.39098 12.3212 2.67876C13.609 3.96657 14.3182 5.67878 14.3182 7.49994C14.3181 9.32126 13.609 11.0335 12.3212 12.3212Z" fill="#78741E"/>
                            </svg>`
                            }</p>`} 
                       
                  
                  ${state.tasks[i].redaction ? '' : `<div id="check"  data-id="${state.tasks[i].id}" ><img src="tap.svg" alt=""></div>`}
        
                    
                     
                       
                        ${state.tasks[i].redaction
                ? `<input type="date" value="${new Date(state.tasks[i].endDate).getFullYear()}-${new Date(state.tasks[i].endDate).getMonth() + 1 < 10 ? `0${new Date(state.tasks[i].endDate).getMonth() + 1}`
                    : new Date(state.tasks[i].endDate).getMonth() + 1}-${new Date(state.tasks[i].endDate).getDate() < 10
                    ? `0${new Date(state.tasks[i].endDate).getDate()}`
                    : new Date(state.tasks[i].endDate).getDate()}" id="update-date" />`
                : `<div class="date"> 
                        <p><span class="fw900">Дата добавления:</span> <span class="start-date">${new Date(state.tasks[i].startDate).toLocaleDateString()}</span></p>
                        ${state.tasks[i].status === "complete" ? `<p> <span class="fw900">Дата выполнения:</span> <span class="start-date">${new Date(state.tasks[i].completeDate).toLocaleDateString()}</span></p>` : ''}
                        <p><span class="fw900">Дедлайн:</span> <span class="end-date">${new Date(state.tasks[i].endDate).toLocaleDateString()}</span> <span class="fw100">${(new Date(state.tasks[i].completeDate) > new Date(state.tasks[i].endDate)) ? `(Просроченно на  ${Math.ceil(Math.abs(new Date(state.tasks[i].completeDate).getTime() - new Date(state.tasks[i].endDate).getTime()) / (1000 * 3600 * 24))} дней)`  : (new Date() > new Date(state.tasks[i].endDate)) ? `(Просроченно на  ${Math.ceil(Math.abs(new Date().getTime() - new Date(state.tasks[i].endDate).getTime()) / (1000 * 3600 * 24))} дней)` : ''}</span></p>
                    </div>`}
            </div>
                    
                
                    
                <div class="action-btn">
                ${(state.tasks[i].status === "complete" || state.tasks[i].status === "outcome") ? ''
                : `${state.tasks[i].redaction ? '<span id="save"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M14.9001 2.82714L12.1729 0.0998758C12.1089 0.0359553 12.0224 0 11.9318 0H1.36365C0.611911 0 0 0.611559 0 1.36365V13.6364C0 14.3884 0.611911 15 1.36365 15H13.6364C14.3881 15 15 14.3885 15 13.6364V3.06818C15 2.97764 14.964 2.89106 14.9001 2.82714ZM3.4091 0.681808H10.9091V4.77272C10.9091 5.14857 10.6035 5.45453 10.2273 5.45453H4.09091C3.71471 5.45453 3.4091 5.14857 3.4091 4.77272V0.681808ZM12.2727 14.3182H2.72726V8.18182H12.2727V14.3182ZM14.3182 13.6364C14.3182 14.0122 14.0126 14.3182 13.6364 14.3182H12.9546V7.8409C12.9546 7.65247 12.8021 7.49998 12.6137 7.49998H2.38638C2.19794 7.49998 2.04546 7.65247 2.04546 7.8409V14.3182H1.36365C0.987444 14.3182 0.68184 14.0122 0.68184 13.6364V1.36365C0.68184 0.987795 0.987476 0.68184 1.36365 0.68184H2.7273V4.77275C2.72726 5.52481 3.33917 6.13637 4.09091 6.13637H10.2273C10.979 6.13637 11.5909 5.52481 11.5909 4.77272V0.681808H11.7907L14.3182 3.20935V13.6364Z" fill="black"/><path d="M8.52256 4.77272H9.88621C10.0746 4.77272 10.2271 4.62024 10.2271 4.4318V1.70454C10.2271 1.5161 10.0746 1.36362 9.88621 1.36362H8.52256C8.33412 1.36362 8.18164 1.5161 8.18164 1.70454V4.4318C8.18164 4.62024 8.33412 4.77272 8.52256 4.77272ZM8.86345 2.04546H9.54526V4.09091H8.86345V2.04546V2.04546Z" fill="black"/></g><defs><clipPath id="clip0"><rect width="15" height="15" fill="white"/></clipPath></defs></svg> </span><span id="back"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5908 4.10591H1.48503L2.76029 2.82534C2.93156 2.65337 2.93098 2.37511 2.759 2.20384C2.587 2.03254 2.30877 2.03315 2.13753 2.20512L0.128086 4.22295C0.0411035 4.31031 -0.00131836 4.42507 0.000322266 4.53935C0.000263672 4.54137 0 4.54334 0 4.54536C0 4.69773 0.0776074 4.83191 0.195381 4.91075L2.13753 6.86098C2.30883 7.03296 2.58703 7.03351 2.759 6.86227C2.93098 6.691 2.93156 6.41274 2.76029 6.24077L1.50955 4.98481H10.5908C12.5374 4.98481 14.1211 6.56848 14.1211 8.51509C14.1211 10.4617 12.5374 12.0454 10.5908 12.0454H0.439453C0.196758 12.0454 0 12.2421 0 12.4848C0 12.7275 0.196758 12.9243 0.439453 12.9243H10.5908C13.0221 12.9243 15 10.9463 15 8.51509C15 6.08386 13.0221 4.10591 10.5908 4.10591Z" fill="black"/></svg></span></span>' : '<span id="change"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5332 1.82528L13.1739 0.465909C12.5529 -0.155155 11.5424 -0.155125 10.9213 0.465909C10.3366 1.0507 1.40528 9.98269 0.808419 10.5796C0.744845 10.6432 0.702247 10.7276 0.687072 10.8103L0.00744257 14.4806C-0.0188953 14.6229 0.0264562 14.7691 0.12879 14.8714C0.231241 14.9738 0.377433 15.0191 0.519552 14.9928L4.18954 14.3131C4.27436 14.2972 4.35774 14.2542 4.42026 14.1917L14.5332 4.078C15.1557 3.4555 15.1558 2.44787 14.5332 1.82528ZM0.988009 14.0121L1.39913 11.7919L3.2081 13.6009L0.988009 14.0121ZM4.10953 13.2594L1.74062 10.8904L10.3893 2.24097L12.7583 4.61006L4.10953 13.2594ZM13.9117 3.45653L13.3797 3.98859L11.0108 1.6195L11.5428 1.08744C11.8211 0.809062 12.274 0.809033 12.5525 1.08744L13.9117 2.44681C14.1908 2.72587 14.1908 3.17745 13.9117 3.45653Z" fill="black"/></svg></span>'}`
            } 
                <span class="close" id="close"><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M9.569 5.43452C9.37497 5.43452 9.21771 5.59177 9.21771 5.7858V12.4251C9.21771 12.619 9.37497 12.7764 9.569 12.7764C9.76303 12.7764 9.92029 12.619 9.92029 12.4251V5.7858C9.92029 5.59177 9.76303 5.43452 9.569 5.43452Z" fill="black"/><path d="M5.42383 5.43452C5.2298 5.43452 5.07254 5.59177 5.07254 5.7858V12.4251C5.07254 12.619 5.2298 12.7764 5.42383 12.7764C5.61786 12.7764 5.77512 12.619 5.77512 12.4251V5.7858C5.77512 5.59177 5.61786 5.43452 5.42383 5.43452Z" fill="black"/><path d="M2.40277 4.46559V13.1206C2.40277 13.6321 2.59035 14.1125 2.91804 14.4572C3.24421 14.8029 3.69814 14.9991 4.1732 14.9999H10.8197C11.2949 14.9991 11.7488 14.8029 12.0748 14.4572C12.4025 14.1125 12.5901 13.6321 12.5901 13.1206V4.46559C13.2415 4.29269 13.6636 3.66339 13.5764 2.99499C13.4892 2.32672 12.9198 1.82682 12.2458 1.82668H10.4472V1.38758C10.4493 1.01831 10.3033 0.663733 10.0419 0.402875C9.78048 0.142154 9.42535 -0.00302612 9.05609 -7.24954e-06H5.93677C5.56751 -0.00302612 5.21238 0.142154 4.95097 0.402875C4.68957 0.663733 4.54356 1.01831 4.54562 1.38758V1.82668H2.74706C2.07303 1.82682 1.5037 2.32672 1.41642 2.99499C1.32929 3.66339 1.75138 4.29269 2.40277 4.46559ZM10.8197 14.2974H4.1732C3.57259 14.2974 3.10535 13.7814 3.10535 13.1206V4.49647H11.8875V13.1206C11.8875 13.7814 11.4203 14.2974 10.8197 14.2974ZM5.2482 1.38758C5.24586 1.20466 5.31777 1.0286 5.44758 0.899479C5.57725 0.770354 5.75372 0.699411 5.93677 0.702567H9.05609C9.23915 0.699411 9.41561 0.770354 9.54529 0.899479C9.6751 1.02847 9.747 1.20466 9.74467 1.38758V1.82668H5.2482V1.38758ZM2.74706 2.52926H12.2458C12.595 2.52926 12.8781 2.81235 12.8781 3.16158C12.8781 3.5108 12.595 3.79389 12.2458 3.79389H2.74706C2.39783 3.79389 2.11474 3.5108 2.11474 3.16158C2.11474 2.81235 2.39783 2.52926 2.74706 2.52926Z" fill="black"/><path d="M7.49645 5.43452C7.30243 5.43452 7.14517 5.59177 7.14517 5.7858V12.4251C7.14517 12.619 7.30243 12.7764 7.49645 12.7764C7.69048 12.7764 7.84773 12.619 7.84773 12.4251V5.7858C7.84773 5.59177 7.69048 5.43452 7.49645 5.43452Z" fill="black"/></g><defs><clipPath id="clip0"><rect width="15" height="15" fill="white"/></clipPath></defs></svg></span>
</div>

</li>`)
    }

    state.filter.length ? document.querySelector('#filter').classList.add('isEnabled') : document.querySelector('#filter').classList.remove('isEnabled')
    state.sorted.length ? document.querySelector('#sort').classList.add('isEnabled') : document.querySelector('#sort').classList.remove('isEnabled')

    state.filter.includes('complete') ? document.querySelector('#sort-complete').classList.add('active') : document.querySelector('#sort-complete').classList.remove('active')
    state.filter.includes('outcome') ? document.querySelector('#sort-outcome').classList.add('active') : document.querySelector('#sort-outcome').classList.remove('active')
    state.filter.includes('process') ? document.querySelector('#sort-process').classList.add('active') : document.querySelector('#sort-process').classList.remove('active')

    state.sorted === "sortName" ? document.querySelector('#sort-name').classList.add('active') : document.querySelector('#sort-name').classList.remove('active')
    state.sorted === "sortDate" ? document.querySelector('#sort-date').classList.add('active') : document.querySelector('#sort-date').classList.remove('active')
    state.sorted === "sortStatus" ? document.querySelector('#sort-status').classList.add('active') : document.querySelector('#sort-status   ').classList.remove('active')


}

// Перерисовка кнопок
function renderSortBtn() {
    state.info.canFilter ? document.querySelectorAll('.filter-btn-wrap, .filter-wrap, #myUl').forEach(el => el.classList.add('active')) : document.querySelectorAll('.filter-btn-wrap, .filter-wrap, #myUl').forEach(el => el.classList.remove('active'))
    state.info.canSort ? document.querySelectorAll('.sort-btn-wrap, .sort-wrap, #myUl').forEach(el => el.classList.add('active')) : document.querySelectorAll('.sort-btn-wrap, .sort-wrap, #myUl').forEach(el => el.classList.remove('active'))
}


function deleteEL(id) {
    state.tasks = state.tasks.filter(t => t.id !== id)
    localStorage.setItem('tasks', JSON.stringify(state.tasks))
    render()
}

// Измененение состояние задачи в режим выбора статуса
function check(id) {
    let [task, idx] = getTask(id);
    const status = !task.checked;
    state.tasks[idx] = {...task, checked: status}
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    render()
}

function completeTask(id) {
    let [task, idx] = getTask(id);
    state.tasks[idx] = {...task, status: "complete", checked: false, completeDate: new Date().toLocaleDateString('en-US')}
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    render()

}

function outcomeTask(id) {
    let [task, idx] = getTask(id);
    state.tasks[idx] = {...task, status: "outcome", checked: false}
    delete state.tasks[idx].completeDate
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    render()
}

function loadingTask(id) {
    let [task, idx] = getTask(id);
    state.tasks[idx] = {...task, checked: false, status: "process"}
    delete state.tasks[idx].completeDate
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    render()
}

// Обновляем данные в задаче
function redactTask(id) {
    let [task, idx] = getTask(id);

    let updateInput = document.getElementById('update-input').value;
    let startDate = state.tasks[idx].startDate;
    let endDate = document.getElementById('update-date').value;
    let updateTask;
    if (updateInput !== '' && new Date(endDate) > new Date()) {
        updateTask = {
            name: updateInput,
            startDate,
            endDate: new Date(endDate).toLocaleDateString('en-US'),
        }
    }

    state.tasks[idx] = {...task, ...updateTask, redaction: !state.tasks[idx].redaction}
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    render()
}

// Измененение состояние задачи в режим редактирования
function toggleRedaction(id) {
    let [task, idx] = getTask(id);
    state.tasks[idx] = {...task, redaction: !state.tasks[idx].redaction}
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    render()
}

// Узнаем по айди нужную задачу
function getTask(id) {
    const idx = state.tasks.findIndex(t => t.id === id)
    const task = state.tasks[idx];
    return [task, idx]
}

// Фильтруем задачи
function filterTask(el, key) {
    el.classList.toggle('active')
    state.filter.includes(key) ? state.filter.splice(state.filter.indexOf(key), 1) : state.filter.push(key)
    localStorage.setItem('filter', JSON.stringify(state.filter));
    state.filter.length >= 1 ? state.tasks.map(t => {
        t.hidden = state.filter.indexOf(t.status) === -1
    }) : state.tasks.map(t => t.hidden = false)

    render()
    localStorage.setItem('tasks', JSON.stringify(state.tasks))
}

function resetFilter() {
    state.filter = []
    localStorage.setItem('filter', JSON.stringify(state.filter))
    state.tasks.map(t => t.hidden = false)
    localStorage.setItem('tasks', JSON.stringify(state.tasks))
    render()
}

// Сортируем задачи
function sortName() {
    state.tasks.sort((a, b) => {
        if (a.name > b.name) {
            return 1
        }
        if (a.name < b.name) {
            return -1
        }
        return 0
    });

    state.sorted = 'sortName'
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    localStorage.setItem('sorted', JSON.stringify(state.sorted));
    render()
}

function sortDate() {
    state.tasks.sort((a, b) => {
        if (new Date(a.endDate) > new Date(b.endDate)) {
            return 1
        }
        if (new Date(a.endDate) < new Date(b.endDate)) {
            return -1
        }
        return 0
    });
    state.sorted = 'sortDate'
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    localStorage.setItem('sorted', JSON.stringify(state.sorted));
    render()
}

function sortStatus() {
    state.tasks.sort((a, b) => {
        if (a.status > b.status) {
            return 1
        }
        if (a.status < b.status) {
            return -1
        }
        return 0
    });
    state.sorted = 'sortStatus'
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    localStorage.setItem('sorted', JSON.stringify(state.sorted));
    render()
}

function resetSort() {
    state.sorted = ''
    localStorage.setItem('sorted', JSON.stringify(state.sorted))
    localStorage.setItem('tasks', JSON.stringify(state.tasks))
    render()
}

// Создание новой задачи
function newElement() {

    let inputValue = document.getElementById('myInput').value;
    let startDate = new Date().toLocaleDateString('en-US');
    let endDate = document.getElementById('date').value;

    if (inputValue === '') {
        alert('Введите текст и коректную дату')
    } else {
        const task = {
            id: Date.now(),
            name: inputValue,
            checked: false,
            status: "process",
            startDate,
            endDate: new Date(endDate).toLocaleDateString('en-US'),
            redaction: false,
            hidden: false,

        };
        state.tasks.push(task)
        state.sorted === 'sortName' ? sortName() : state.sorted === 'sortDate' ? sortDate() : state.sorted === 'sortStatus' ? sortStatus() : ''
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
        render()
    }
}

render()

window.onkeypress = function (e) {
    if (e.which === 13 && (state.tasks.every(task => !task.redaction) || !state.tasks)) {
        newElement()
    }
}

// Отслеживание кликов на задаче
myNodeList.addEventListener('click', function (ev) {
    if (ev.target.id === 'check' && !ev.target.classList.contains('redaction') || (ev.target.tagName === "LI" && !ev.target.classList.contains('redaction'))) {
        check(+ev.target.dataset.id)
    } else if (ev.target.id === 'done') {
        completeTask(+ev.target.offsetParent.dataset.id)
    } else if (ev.target.id === 'undone') {
        outcomeTask(+ev.target.offsetParent.dataset.id)
    } else if (ev.target.id === 'loading') {
        loadingTask(+ev.target.offsetParent.dataset.id)
    } else if (ev.target.id === 'change') {
        toggleRedaction(+ev.target.offsetParent.dataset.id)
    } else if (ev.target.id === 'save') {
        redactTask(+ev.target.offsetParent.dataset.id)
    } else if (ev.target.id === 'close') {
        deleteEL(+ev.target.offsetParent.dataset.id)
    } else if (ev.target.id === 'back') {
        toggleRedaction(+ev.target.offsetParent.dataset.id)
    }
}, false);

// Отслеживание кликов на кнопках сортировки
sortElements.addEventListener('click', (e) => {
    if (e.target.id === "sort") {
        state.info.canSort = !state.info.canSort
        e.target.classList.toggle('chosen')
        renderSortBtn()
    }
    else if (e.target.id === "sort-name" && state.sorted !== 'sortName') {
        sortName()
    } else if (e.target.id === "sort-date" && state.sorted !== 'sortDate') {
        sortDate()
    } else if (e.target.id === "sort-status" &&  state.sorted !== 'sortStatus') {
        sortStatus()
    } else {
        resetSort()
    }
})

// Отслеживание кликов на кнопках фильтрации
filterElements.addEventListener('click', (e) => {
    if (e.target.id === "filter") {
        state.info.canFilter = !state.info.canFilter
        e.target.classList.toggle('chosen')
        renderSortBtn()
    } else if (e.target.id === "sort-complete") {
        filterTask(e.target, 'complete')
    } else if (e.target.id === "sort-outcome") {
        filterTask(e.target, 'outcome')
    } else if (e.target.id === 'sort-process') {
        filterTask(e.target, 'process')
    } else {
        resetFilter()
    }
})


// Драг н дроп
tasksListElement.addEventListener(
    `dragstart`, (evt) => {
        evt.target.classList.add(
            `selected`
        );
    });

tasksListElement.addEventListener(
    `dragend`

    , (evt) => {
        evt.target.classList.remove(
            `selected`
        );
        arrayChildren = Array.from(myNodeList.childNodes)
        arrayChildren.forEach((t, index) => {
            if (state.tasks[index].id !== +t.dataset.id) {
                let [task, idx] = getTask(state.tasks[index].id)
                let [changeTask, changeIdx] = getTask(+t.dataset.id)
                let tmp = state.tasks[idx]
                state.tasks[idx] = {...state.tasks[changeIdx]}
                state.tasks[changeIdx] = {...tmp}
            }
            localStorage.setItem('tasks', JSON.stringify(state.tasks));
        })
    });

const getNextElement = (cursorPosition, currentElement) => {
    const currentElementCoord = currentElement.getBoundingClientRect();
    const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

    const nextElement = (cursorPosition < currentElementCenter) ?
        currentElement :
        currentElement.nextElementSibling;

    return nextElement;
};

tasksListElement.addEventListener(
    `dragover`

    , (evt) => {
        evt.preventDefault();

        const activeElement = tasksListElement.querySelector(`.selected`);
        const currentElement = evt.target;

        const isMoveable = activeElement !== currentElement &&
            currentElement.classList.contains(`task`);

        if (!isMoveable) {
            return;
        }

        const nextElement = getNextElement(evt.clientY, currentElement);

        if (nextElement && activeElement === nextElement.previousElementSibling || activeElement === nextElement) {
            return;
        }


        tasksListElement.insertBefore(activeElement, nextElement);
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
    });
