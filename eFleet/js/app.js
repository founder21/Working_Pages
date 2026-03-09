(() => {
    "use strict";
    const modules_flsModules = {};
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout(() => {
                lockPaddingElements.forEach(lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                });
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }, delay);
            bodyLockStatus = false;
            setTimeout(function() {
                bodyLockStatus = true;
            }, delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach(lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            });
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout(function() {
                bodyLockStatus = true;
            }, delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        });
    }
    function functions_FLS(message) {
        setTimeout(() => {
            if (window.FLS) console.log(message);
        }, 0);
    }
    function uniqArray(array) {
        return array.filter(function(item, index, self) {
            return self.indexOf(item) === index;
        });
    }
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                this.scrollWatcherLogging(`Прокинувся, стежу за об'єктами (${items.length})...`);
                let uniqParams = uniqArray(Array.from(items).map(function(item) {
                    if (item.dataset.watch === "navigator" && !item.dataset.watchThreshold) {
                        let valueOfThreshold;
                        if (item.clientHeight > 2) {
                            valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
                            if (valueOfThreshold > 1) valueOfThreshold = 1;
                        } else valueOfThreshold = 1;
                        item.setAttribute("data-watch-threshold", valueOfThreshold.toFixed(2));
                    }
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                }));
                uniqParams.forEach(uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter(function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    });
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                });
            } else this.scrollWatcherLogging("Сплю, немає об'єктів для стеження. ZzzZZzz");
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if (paramsWatch.root !== "null") this.scrollWatcherLogging(`Эмм... батьківського об'єкта ${paramsWatch.root} немає на сторінці`);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging(`йой, налаштування data-watch-margin потрібно задавати в PX або %`);
                return;
            }
            if (paramsWatch.threshold === "prx") {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            console.log(configWatcher);
            this.observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    this.scrollWatcherCallback(entry, observer);
                });
            }, configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach(item => this.observer.observe(item));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) {
                !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                this.scrollWatcherLogging(`Я бачу ${targetElement.classList}, додав клас _watcher-view`);
            } else {
                targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                this.scrollWatcherLogging(`Я не бачу ${targetElement.classList}, прибрав клас _watcher-view`);
            }
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
            this.scrollWatcherLogging(`Я перестав стежити за ${targetElement.classList}`);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? functions_FLS(`[Спостерігач]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    modules_flsModules.watcher = new ScrollWatcher({});
    let addWindowScrollEvent = false;
    setTimeout(() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", function(e) {
                document.dispatchEvent(windowScroll);
            });
        }
    }, 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach(node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767.98";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            });
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map(({breakpoint}) => `(${this.type}-width: ${breakpoint / 16}em),${breakpoint}`).filter((item, index, self) => self.indexOf(item) === index);
            this.mediaQueries.forEach(media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter(({breakpoint}) => breakpoint === mediaBreakpoint);
                matchMedia.addEventListener("change", () => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                });
                this.mediaHandler(matchMedia, оbjectsFilter);
            });
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach(оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            }); else оbjects.forEach(({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            });
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            }); else {
                arr.sort((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                });
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    class DonutChart {
        constructor(container, data, options = {}) {
            this.container = typeof container === "string" ? document.querySelector(container) : container;
            this.data = data;
            this.options = {
                size: options.size || 200,
                thickness: options.thickness || 20,
                totalLabel: options.totalLabel || "Total",
                fontFamily: options.fontFamily || "Inter, sans-serif",
                ...options
            };
            this.init();
        }
        init() {
            if (!this.container) return;
            this.container.innerHTML = "";
            this.container.style.width = `${this.options.size}px`;
            this.container.style.position = "relative";
            const canvasContainer = document.createElement("div");
            canvasContainer.style.position = "relative";
            canvasContainer.style.width = `${this.options.size}px`;
            canvasContainer.style.height = `${this.options.size}px`;
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", this.options.size);
            svg.setAttribute("height", this.options.size);
            svg.setAttribute("viewBox", `0 0 ${this.options.size} ${this.options.size}`);
            this.renderSegments(svg);
            this.renderText(canvasContainer);
            canvasContainer.appendChild(svg);
            this.container.appendChild(canvasContainer);
            this.renderLegend();
        }
        renderSegments(svg) {
            const center = this.options.size / 2;
            const radius = (this.options.size - this.options.thickness) / 2;
            const circumference = 2 * Math.PI * radius;
            let totalValue = this.data.reduce((acc, item) => acc + item.value, 0);
            let currentAngle = -90;
            const gapPx = 2;
            const gapDegrees = gapPx / circumference * 360;
            this.data.forEach((item, index) => {
                const percentage = item.value / totalValue;
                const angle = percentage * 360;
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", center);
                circle.setAttribute("cy", center);
                circle.setAttribute("r", radius);
                circle.setAttribute("fill", "transparent");
                circle.setAttribute("stroke", item.color);
                circle.setAttribute("stroke-width", this.options.thickness);
                circle.setAttribute("stroke-linecap", "butt");
                const arcLength = Math.max(.1, circumference * angle / 360 - gapPx);
                circle.setAttribute("stroke-dasharray", `0 ${circumference}`);
                circle.style.transition = "stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1)";
                const rotation = currentAngle + gapDegrees / 2;
                circle.setAttribute("transform", `rotate(${rotation} ${center} ${center})`);
                svg.appendChild(circle);
                setTimeout(() => {
                    circle.setAttribute("stroke-dasharray", `${arcLength} ${circumference}`);
                }, 100 + index * 100);
                currentAngle += angle;
            });
        }
        renderText(container) {
            const textContainer = document.createElement("div");
            textContainer.style.cssText = "position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); text-align:center; width:100%; pointer-events:none; display: flex; flex-direction: column; gap: 4px; opacity: 0; transition: opacity 0.8s ease-out 0.3s;";
            const totalRaw = this.data.reduce((acc, i) => acc + i.value, 0);
            const formattedValue = this.options.valueFormatter ? this.options.valueFormatter(totalRaw) : totalRaw.toLocaleString();
            textContainer.innerHTML = `\n            <div style="font-size:20px; font-weight:500; color:#fff; font-family:${this.options.fontFamily}">${formattedValue}</div>\n            <div style="font-size:14px; color:#b3b3b3; font-family:${this.options.fontFamily}">${this.options.totalLabel}</div>\n        `;
            container.appendChild(textContainer);
            setTimeout(() => {
                textContainer.style.opacity = "1";
            }, 100);
        }
        renderLegend() {
            const legend = document.createElement("div");
            legend.style.cssText = `\n      display: grid; \n      grid-template-columns: 1fr auto auto; \n      gap: 12px 16px; \n      margin-top: 40px; \n      width: 100%; \n      color: #fff; \n      font-size: 14px;\n      opacity: 0;\n      transform: translateY(10px);\n      transition: all 0.8s ease-out 0.5s;\n    `;
            const total = this.data.reduce((acc, i) => acc + i.value, 0);
            const currencyPrefix = this.options.valueFormatter && this.options.valueFormatter(0).includes("₴") ? "₴ " : "";
            this.data.forEach(item => {
                legend.innerHTML += `\n        <div style="display:flex; align-items:center; gap:8px;">\n            <div style="width:8px; height:8px; border-radius:50%; background:${item.color}"></div>\n            <span style="color:#b3b3b3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.label}</span>\n        </div>\n        <div style="text-align:right; font-weight: 500;">${currencyPrefix}${item.value.toLocaleString()}</div>\n        <div style="text-align:right; color:#7c7c7c; min-width:50px;">${(item.value / total * 100).toFixed(1)}%</div>\n      `;
            });
            this.container.appendChild(legend);
            setTimeout(() => {
                legend.style.opacity = "1";
                legend.style.transform = "translateY(0)";
            }, 100);
        }
    }
    class StackedBarChart {
        constructor(container, data, options = {}) {
            this.container = typeof container === "string" ? document.querySelector(container) : container;
            this.data = data;
            this.options = {
                height: options.height || 300,
                barWidth: options.barWidth || 40,
                fontFamily: options.fontFamily || "Inter, sans-serif",
                maxValue: options.maxValue || 12e3,
                yAxisTicks: options.yAxisTicks || [ 12e3, 1e4, 8e3, 6e3, 4e3, 2e3, 0 ],
                ...options
            };
            this.init();
        }
        init() {
            if (!this.container) return;
            this.container.innerHTML = "";
            this.container.style.display = "flex";
            this.container.style.gap = "12px";
            this.container.style.fontFamily = this.options.fontFamily;
            this.container.style.color = "#b3b3b3";
            this.container.style.alignItems = "flex-start";
            const yAxis = document.createElement("div");
            yAxis.style.display = "flex";
            yAxis.style.flexDirection = "column";
            yAxis.style.justifyContent = "space-between";
            yAxis.style.height = `${this.options.height}px`;
            yAxis.style.textAlign = "right";
            yAxis.style.fontSize = "12px";
            yAxis.style.width = "70px";
            yAxis.style.flexShrink = "0";
            this.options.yAxisTicks.forEach(tick => {
                const label = document.createElement("div");
                label.textContent = `₴ ${tick.toLocaleString()}`;
                yAxis.appendChild(label);
            });
            const chartArea = document.createElement("div");
            chartArea.style.position = "relative";
            chartArea.style.flex = "1";
            chartArea.style.width = "100%";
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", (this.options.height + 40).toString());
            svg.style.display = "block";
            this.renderGrid(svg);
            this.renderBars(svg);
            this.renderXAxis(svg);
            chartArea.appendChild(svg);
            this.container.appendChild(yAxis);
            this.container.appendChild(chartArea);
        }
        renderGrid(svg) {
            const ticksCount = this.options.yAxisTicks.length;
            for (let i = 0; i < ticksCount; i++) {
                const y = i / (ticksCount - 1) * this.options.height;
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", "0");
                line.setAttribute("y1", y.toString());
                line.setAttribute("x2", "100%");
                line.setAttribute("y2", y.toString());
                line.setAttribute("stroke", "#373737");
                line.setAttribute("stroke-width", "1");
                svg.appendChild(line);
            }
        }
        renderBars(svg) {
            const barCount = this.data.length;
            const gapBetweenSegments = 2;
            this.data.forEach((day, index) => {
                let currentY = this.options.height;
                const xPercent = index / barCount * 100 + 100 / barCount / 2;
                day.segments.forEach((segment, segIndex) => {
                    const segHeight = segment.value / this.options.maxValue * this.options.height;
                    if (segHeight < 1) return;
                    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    const yPos = currentY - segHeight;
                    rect.setAttribute("x", `${xPercent}%`);
                    rect.setAttribute("y", currentY.toString());
                    rect.setAttribute("width", this.options.barWidth.toString());
                    rect.setAttribute("height", "0");
                    rect.setAttribute("fill", segment.color);
                    rect.setAttribute("transform", `translate(-${this.options.barWidth / 2}, 0)`);
                    if (segIndex === day.segments.length - 1) {
                        rect.setAttribute("rx", "4");
                        rect.setAttribute("ry", "4");
                    }
                    rect.innerHTML = `\n          <animate attributeName="y" from="${currentY}" to="${yPos}" dur="0.8s" fill="freeze" />\n          <animate attributeName="height" from="0" to="${Math.max(0, segHeight - gapBetweenSegments)}" dur="0.8s" fill="freeze" />\n        `;
                    svg.appendChild(rect);
                    currentY -= segHeight;
                });
            });
        }
        renderXAxis(svg) {
            const barCount = this.data.length;
            this.data.forEach((day, index) => {
                const xPercent = index / barCount * 100 + 100 / barCount / 2;
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute("x", `${xPercent}%`);
                text.setAttribute("y", (this.options.height + 25).toString());
                text.setAttribute("text-anchor", "middle");
                text.setAttribute("fill", "#b3b3b3");
                text.setAttribute("font-size", "12px");
                text.textContent = day.label;
                svg.appendChild(text);
            });
        }
    }
    window.StackedBarChart = StackedBarChart;
    window["FLS"] = true;
    menuInit();
    window.DonutChart = DonutChart;
})();